// Artists Visional has worked with, shown as a festival-style lineup in the Events section.
//
// - red: artists Visional worked with directly (not as a house VJ). They stay red and keep
//   every fourth spot in the lineup (1st, 5th, 9th, ...), in the order listed here.
// - Every other artist is ranked by total following (instagram + tiktok + spotify), biggest
//   first, and fills the spots in between.
//
// The follower numbers are rough estimates (November 2026), not live counts: update any that
// look off. They only decide the order; visitors never see them. Spotify means followers,
// not monthly listeners.
export const ARTISTS = [
    // Red, in lineup order
    { name: "DJ Diesel (Shaq)", red: true, instagram: 4000000, tiktok: 3000000, spotify: 1000000 },
    { name: "Valentino Khan", red: true, instagram: 400000, tiktok: 100000, spotify: 500000 },
    { name: "Sidepiece", red: true, instagram: 200000, tiktok: 100000, spotify: 300000 },
    { name: "Midnight Tyrannosaurus", red: true, instagram: 150000, tiktok: 100000, spotify: 120000 },
    { name: "Tynan", red: true, instagram: 120000, tiktok: 80000, spotify: 100000 },
    { name: "Space Laces", red: true, instagram: 100000, tiktok: 50000, spotify: 80000 },
    { name: "Shipwrek", red: true, instagram: 60000, tiktok: 30000, spotify: 40000 },
    { name: "Ayybo", red: true, instagram: 30000, tiktok: 20000, spotify: 30000 },
    { name: "Desert Dwellers", red: true, instagram: 60000, tiktok: 5000, spotify: 80000 },
    { name: "Heyz", red: true, instagram: 30000, tiktok: 10000, spotify: 15000 },
    { name: "DJ Pressed", red: true, instagram: 15000, tiktok: 5000, spotify: 5000 },
    { name: "Savej", red: true, instagram: 40000, tiktok: 10000, spotify: 40000 },
    { name: "Green Matter", red: true, instagram: 15000, tiktok: 10000, spotify: 8000 },
    { name: "Pretty Sweet", red: true, instagram: 20000, tiktok: 15000, spotify: 15000 },
    { name: "PapaJay", red: true, instagram: 8000, tiktok: 3000, spotify: 3000 },
    { name: "Spoone", red: true, instagram: 5000, tiktok: 2000, spotify: 2000 },
    { name: "Lil Fish", red: true, instagram: 8000, tiktok: 5000, spotify: 3000 },

    // Everyone else, in any order (sorted automatically)
    { name: "Getter", instagram: 700000, tiktok: 400000, spotify: 500000 },
    { name: "Purple Disco Machine", instagram: 600000, tiktok: 150000, spotify: 700000 },
    { name: "The Glitch Mob", instagram: 300000, tiktok: 50000, spotify: 600000 },
    { name: "Wuki", instagram: 200000, tiktok: 300000, spotify: 150000 },
    { name: "Bear Grillz", instagram: 400000, tiktok: 300000, spotify: 250000 },
    { name: "Netsky", instagram: 450000, tiktok: 100000, spotify: 700000 },
    { name: "Coco & Breezy", instagram: 300000, tiktok: 50000, spotify: 30000 },
    { name: "Rusko", instagram: 300000, tiktok: 100000, spotify: 400000 },
    { name: "Jkyl & Hyde", instagram: 60000, tiktok: 20000, spotify: 70000 },
    { name: "Hills", instagram: 6000, tiktok: 3000, spotify: 4000 },
    { name: "Hol!", instagram: 60000, tiktok: 80000, spotify: 30000 },
    { name: "Bolo", instagram: 10000, tiktok: 5000, spotify: 5000 },
    { name: "The Gaslamp Killer", instagram: 120000, tiktok: 10000, spotify: 80000 },
    { name: "Wreckno", instagram: 150000, tiktok: 400000, spotify: 50000 },
    { name: "Skepsis", instagram: 100000, tiktok: 50000, spotify: 100000 },
    { name: "Noizu", instagram: 120000, tiktok: 50000, spotify: 120000 },
    { name: "MC4D", instagram: 25000, tiktok: 10000, spotify: 10000 },
    { name: "UZ", instagram: 100000, tiktok: 20000, spotify: 150000 },
    { name: "Maddy O’Neal", instagram: 50000, tiktok: 15000, spotify: 40000 },
    { name: "Sisto", instagram: 40000, tiktok: 20000, spotify: 20000 },
    { name: "Figure", instagram: 50000, tiktok: 20000, spotify: 60000 },
    { name: "Swimming Paul", instagram: 30000, tiktok: 20000, spotify: 30000 },
    { name: "Phutureprimitive", instagram: 40000, tiktok: 5000, spotify: 40000 },
    { name: "Pauline Herr", instagram: 50000, tiktok: 60000, spotify: 70000 },
    { name: "DMVU", instagram: 60000, tiktok: 30000, spotify: 40000 },
    { name: "Kumarion", instagram: 40000, tiktok: 30000, spotify: 30000 },
    { name: "Jon Casey", instagram: 15000, tiktok: 5000, spotify: 15000 },
    { name: "WonkyWilla", instagram: 20000, tiktok: 30000, spotify: 15000 },
    { name: "Lizzy Jane", instagram: 25000, tiktok: 15000, spotify: 15000 },
    { name: "Random Rab", instagram: 30000, tiktok: 5000, spotify: 50000 },
    { name: "David Starfire", instagram: 30000, tiktok: 5000, spotify: 20000 },
    { name: "Hostage Situation", instagram: 20000, tiktok: 10000, spotify: 10000 },
    { name: "Habitaat", instagram: 10000, tiktok: 5000, spotify: 5000 },
    { name: "Twopercent", instagram: 12000, tiktok: 8000, spotify: 8000 },
    { name: "OG Nixin", instagram: 20000, tiktok: 30000, spotify: 10000 },
    { name: "Benda", instagram: 8000, tiktok: 3000, spotify: 5000 },
    { name: "Tsu Nami", instagram: 15000, tiktok: 10000, spotify: 10000 },
    { name: "Toadface", instagram: 15000, tiktok: 20000, spotify: 10000 },
    { name: "The Sponges", instagram: 8000, tiktok: 3000, spotify: 3000 },
    { name: "Chozen", instagram: 8000, tiktok: 3000, spotify: 5000 },
    { name: "Noetika", instagram: 5000, tiktok: 2000, spotify: 3000 },
    { name: "Dela Moon", instagram: 6000, tiktok: 3000, spotify: 3000 },
    { name: "MFinity", instagram: 4000, tiktok: 2000, spotify: 2000 },
    { name: "MZG", instagram: 3000, tiktok: 1000, spotify: 2000 },
    { name: "Swampz", instagram: 6000, tiktok: 3000, spotify: 3000 },
    { name: "Covex", instagram: 10000, tiktok: 5000, spotify: 5000 },
    { name: "Decker Rush", instagram: 4000, tiktok: 2000, spotify: 2000 },
    { name: "Nyrus", instagram: 4000, tiktok: 2000, spotify: 2000 },
    { name: "Omas", instagram: 5000, tiktok: 2000, spotify: 3000 },
    { name: "Bruer", instagram: 3000, tiktok: 1000, spotify: 1000 },
    { name: "Vinnie Maniscalco", instagram: 3000, tiktok: 1000, spotify: 1000 },
];

export function totalFollowing(artist) {
    return (artist.instagram || 0) + (artist.tiktok || 0) + (artist.spotify || 0);
}

// Red artists hold every fourth spot in their listed order; everyone else fills the gaps,
// ranked by total following. If one group runs out, the other fills the rest.
export function buildLineup(artists = ARTISTS) {
    const red = artists.filter((artist) => artist.red);
    const others = artists
        .filter((artist) => !artist.red)
        .sort((a, b) => totalFollowing(b) - totalFollowing(a));
    const lineup = [];
    while (red.length || others.length) {
        const redSpot = lineup.length % 4 === 0;
        const next = (redSpot ? red.shift() : others.shift()) || red.shift() || others.shift();
        lineup.push(next);
    }
    return lineup;
}
