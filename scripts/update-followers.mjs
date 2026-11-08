// Refreshes each artist's Spotify follower count in src/data/artists.json, using Spotify's
// official Web API. Run weekly by .github/workflows/update-followers.yml; can also be run by
// hand with SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET set.
//
// Instagram and TikTok counts are left as they are: neither offers an allowed way to read other
// accounts' counts automatically, so those are refreshed by hand.
//
// If Spotify can't be reached or an artist isn't found, that artist keeps their last number,
// so a bad week never scrambles the lineup.
import { readFile, writeFile } from "node:fs/promises";

const DATA_FILE = new URL("../src/data/artists.json", import.meta.url);
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET (from developer.spotify.com).");
    process.exit(1);
}

async function getToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });
    if (!response.ok) throw new Error(`Spotify sign-in failed: ${response.status} ${await response.text()}`);
    return (await response.json()).access_token;
}

// Asks Spotify for one URL, waiting and retrying if told to slow down
async function spotifyGet(token, url) {
    for (let attempt = 0; attempt < 3; attempt++) {
        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (response.status === 429) {
            const wait = Number(response.headers.get("retry-after") || 5);
            await new Promise((resolve) => setTimeout(resolve, wait * 1000));
            continue;
        }
        return response;
    }
    throw new Error(`Spotify kept asking to slow down: ${url}`);
}

// Tries up to 50 artists per request first. Some Spotify apps aren't allowed the bulk request,
// so if it's refused, this falls back to asking for each artist on its own.
async function getFollowers(token, ids) {
    const followers = new Map();
    const bulk = await spotifyGet(token, `https://api.spotify.com/v1/artists?ids=${ids.slice(0, 50).join(",")}`);
    if (bulk.ok) {
        for (let i = 0; i < ids.length; i += 50) {
            const response = i === 0 ? bulk : await spotifyGet(token, `https://api.spotify.com/v1/artists?ids=${ids.slice(i, i + 50).join(",")}`);
            if (!response.ok) throw new Error(`Spotify artists request failed: ${response.status} ${await response.text()}`);
            for (const artist of (await response.json()).artists) {
                if (artist) followers.set(artist.id, artist.followers.total);
            }
        }
        return followers;
    }
    console.warn(`Bulk request refused (${bulk.status} ${await bulk.text()}); asking for each artist on its own`);
    for (const id of ids) {
        const response = await spotifyGet(token, `https://api.spotify.com/v1/artists/${id}`);
        if (!response.ok) {
            console.warn(`Artist ${id}: ${response.status} ${await response.text()}`);
            continue;
        }
        const artist = await response.json();
        if (artist?.followers) followers.set(artist.id, artist.followers.total);
        await new Promise((resolve) => setTimeout(resolve, 150));
    }
    return followers;
}

const data = JSON.parse(await readFile(DATA_FILE, "utf8"));

// Every Spotify account to refresh, including linked ones (Shaq's for DJ Diesel)
const accounts = data.artists.flatMap((artist) => [artist, ...(artist.alsoCount || [])]).filter((account) => account.spotify?.id);
const followers = await getFollowers(await getToken(), [...new Set(accounts.map((account) => account.spotify.id))]);

let updated = 0;
for (const account of accounts) {
    const count = followers.get(account.spotify.id);
    if (count === undefined) {
        console.warn(`No Spotify result for ${account.name} (${account.spotify.id}); keeping the old number`);
        continue;
    }
    if (account.spotify.followers !== count || "listeners" in account.spotify) updated += 1;
    account.spotify = { id: account.spotify.id, followers: count };
}

if (updated) {
    data.updated = new Date().toISOString().slice(0, 10);
    await writeFile(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`);
}
console.log(`Spotify followers: ${followers.size}/${accounts.length} found, ${updated} changed`);
