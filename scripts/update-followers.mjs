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

// Spotify accepts up to 50 artist IDs per request; waits and retries if asked to slow down
async function getFollowers(token, ids) {
    const followers = new Map();
    for (let i = 0; i < ids.length; i += 50) {
        const batch = ids.slice(i, i + 50);
        for (let attempt = 0; attempt < 3; attempt++) {
            const response = await fetch(`https://api.spotify.com/v1/artists?ids=${batch.join(",")}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 429) {
                const wait = Number(response.headers.get("retry-after") || 5);
                await new Promise((resolve) => setTimeout(resolve, wait * 1000));
                continue;
            }
            if (!response.ok) throw new Error(`Spotify artists request failed: ${response.status}`);
            for (const artist of (await response.json()).artists) {
                if (artist) followers.set(artist.id, artist.followers.total);
            }
            break;
        }
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
