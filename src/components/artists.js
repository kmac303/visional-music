// Artists Visional has worked with, shown as a lineup in the Events section.
//
// The artists, their accounts and their latest counts live in src/data/artists.json, so a
// scheduled job can refresh the numbers without touching this code.
// - red: artists Visional worked with directly (not as a house VJ). They stay red and keep
//   every fourth spot in the lineup (1st, 5th, 9th, ...).
// - pinFirst: always the first name in the lineup (DJ Diesel).
// - Following = Instagram followers + TikTok followers + Spotify monthly listeners, plus any
//   linked accounts in alsoCount (Shaq's for DJ Diesel). Both groups are ranked by it,
//   biggest first: red artists among the red spots, everyone else in between.
import data from "../data/artists.json";

export const ARTISTS = data.artists;

function accountTotal(account) {
    return (account.instagram?.followers || 0)
        + (account.tiktok?.followers || 0)
        + (account.spotify?.listeners || 0);
}

export function totalFollowing(artist) {
    return accountTotal(artist) + (artist.alsoCount || []).reduce((sum, extra) => sum + accountTotal(extra), 0);
}

// Red artists hold every fourth spot and everyone else fills the gaps, each group ranked by
// total following, with a pinned artist always first. If one group runs out, the other
// fills the rest.
export function buildLineup(artists = ARTISTS) {
    const rank = (a, b) => (b.pinFirst ? 1 : 0) - (a.pinFirst ? 1 : 0) || totalFollowing(b) - totalFollowing(a);
    const red = artists.filter((artist) => artist.red).sort(rank);
    const others = artists.filter((artist) => !artist.red).sort(rank);
    const lineup = [];
    while (red.length || others.length) {
        const redSpot = lineup.length % 4 === 0;
        const next = (redSpot ? red.shift() : others.shift()) || red.shift() || others.shift();
        lineup.push(next);
    }
    return lineup;
}
