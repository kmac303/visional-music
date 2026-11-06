// Live audio levels, written by AudioBackground every frame and read by
// anything else on the page that reacts to the music (like the logo).
export const audioLevels = {
    playing: false,
    // "track", "mic", or "off"
    source: "off",
    bass: 0,
    mid: 0,
    high: 0,
    kick: 0,
    kicks: 0,
    // How much bass is present (0-1); this drives the datamosh flow
    presence: 0,
    // Tempo estimated from the gaps between hits; 0 until it locks on
    bpm: 0,
    // What the background is doing: "active", "drift", "hold", or "frozen"
    flow: "hold",
    // Frames drawn while sound is on, like timecode on VJ software
    frame: 0,
    // Track position and length in seconds (0 for the mic)
    time: 0,
    duration: 0,
};

// Controls the visitor can use from the hero readouts, read by AudioBackground
// every frame. The request counters go up by one per click.
export const moshControls = {
    // Hold the background still even while sound is on
    freeze: false,
    // How strongly the sound moves the background, from 0.01 to 1 (the Flow slider).
    // Starts at full on every page load.
    flowAmount: 1,
    // Wipe the background back to the clean image
    clearRequests: 0,
    // Fire a hit by hand, like a detected kick
    hitRequests: 0,
};
