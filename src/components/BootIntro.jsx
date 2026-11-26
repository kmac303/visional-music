import { useEffect, useState } from "react";

// A quick terminal-style "boot" on the first page load of a visit: a few lines type out,
// the signal locks to LIVE, then it fades away to reveal the site. About a second and a
// half, skipped by any click, tap, scroll or key, and shown once per visit (the browser
// tab remembers it until it's closed).
const LINES = [
    "[00] // begin_transmission",
    "> source: visional.exe",
    "> signal: locking",
];
const SEEN_KEY = "visional-boot-seen";

function alreadySeen() {
    try {
        return sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
        return false;
    }
}

function BootIntro() {
    // Characters typed so far across all lines, and whether the signal has locked
    const [typed, setTyped] = useState(0);
    const [live, setLive] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [done, setDone] = useState(alreadySeen);

    useEffect(() => {
        if (done) return;
        try {
            sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
            // Storage blocked: it may show again next load, which is harmless
        }

        const total = LINES.reduce((sum, line) => sum + line.length, 0);
        const timers = [];
        const finish = () => {
            setLeaving(true);
            timers.push(setTimeout(() => setDone(true), 350));
        };

        // Type fast: the whole text in about 0.8 seconds
        let count = 0;
        const typer = setInterval(() => {
            count += 3;
            setTyped(Math.min(count, total));
            if (count >= total) {
                clearInterval(typer);
                timers.push(setTimeout(() => setLive(true), 120));
                timers.push(setTimeout(finish, 520));
            }
        }, 1000 / 60 * 1.5);

        const skip = () => finish();
        const events = ["pointerdown", "keydown", "wheel", "touchstart"];
        events.forEach((type) => window.addEventListener(type, skip, { once: true, passive: true }));
        return () => {
            clearInterval(typer);
            timers.forEach(clearTimeout);
            events.forEach((type) => window.removeEventListener(type, skip));
        };
    }, [done]);

    if (done) return null;

    // Split the typed characters across the lines
    let remaining = typed;
    const shown = LINES.map((line) => {
        const part = line.slice(0, Math.max(0, remaining));
        remaining -= line.length;
        return part;
    });
    const typingLine = shown.findIndex((part, index) => part.length < LINES[index].length);

    return (
        <div className={`boot-intro${leaving ? " is-leaving" : ""}`} aria-hidden="true">
            <div className="boot-intro-text">
                {shown.map((part, index) => (
                    <div key={index} className="boot-intro-line">
                        {part}
                        {index === (typingLine === -1 ? LINES.length - 1 : typingLine) && !live && (
                            <span className="terminal-cursor" />
                        )}
                    </div>
                ))}
                <div className={`boot-intro-status${live ? " is-live" : ""}`}>
                    {live ? "● LIVE" : " "}
                </div>
            </div>
        </div>
    );
}

export default BootIntro;
