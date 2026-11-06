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
    // What the background is doing: "active", "drift", or "hold"
    flow: "hold",
    // Frames drawn while sound is on, like timecode on VJ software
    frame: 0,
    // Track position and length in seconds (0 for the mic)
    time: 0,
    duration: 0,
};
