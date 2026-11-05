import { useEffect, useRef, useState } from "react";
import { audioLevels } from "./audioLevels";

// Red-only and cyan-only copies of the logo; on top of each other they add back up to the original
const RED_LAYER = "/assets/logo-glitch-red.png";
const CYAN_LAYER = "/assets/logo-glitch-cyan.png";

// Feedback echoes trailing behind the logo, alternating red and cyan
const ECHOES = [RED_LAYER, CYAN_LAYER, RED_LAYER];
// How many frames behind each echo follows
const ECHO_DELAY = 5;

function GlitchLogo({ src, alt, className }) {
    const wrapperRef = useRef(null);
    // The extra layers only load once music has started
    const [layersLoaded, setLayersLoaded] = useState(false);

    useEffect(() => {
        const el = wrapperRef.current;
        let frame;
        let last = performance.now();
        let kicksSeen = audioLevels.kicks;
        let glitching = false;
        let tear = 0;
        let tearDirection = 1;
        let feedback = 0;
        // Recent split positions, newest first, so echoes can trail behind
        const history = [];

        function reset() {
            el.classList.remove("glitching");
            el.style.removeProperty("--split-x");
            el.style.removeProperty("--split-y");
            el.style.removeProperty("--tear");
            el.style.removeProperty("--feedback");
            history.length = 0;
            feedback = 0;
        }

        function tick(now) {
            frame = requestAnimationFrame(tick);
            const dt = Math.min(0.1, (now - last) / 1000);
            last = now;

            if (!audioLevels.playing) {
                if (glitching) {
                    glitching = false;
                    reset();
                }
                kicksSeen = audioLevels.kicks;
                return;
            }
            if (!glitching) {
                glitching = true;
                setLayersLoaded(true);
                el.classList.add("glitching");
            }

            const { mid, kick, bass } = audioLevels;

            // Big kicks tear a random horizontal slice of the logo sideways
            if (audioLevels.kicks !== kicksSeen) {
                kicksSeen = audioLevels.kicks;
                // Every kick blooms the feedback; it fades over about half a second
                feedback = Math.max(feedback, 0.35 + 0.35 * bass);
                if (bass > 0.55) {
                    tear = 1;
                    tearDirection = Math.random() < 0.5 ? -1 : 1;
                    const top = 10 + Math.random() * 60;
                    el.style.setProperty("--tear-top", `${top}%`);
                    el.style.setProperty("--tear-bottom", `${100 - top - (6 + Math.random() * 14)}%`);
                }
            }
            tear *= Math.exp(-dt / 0.1);
            const trace = 0.12 * mid;
            feedback = trace + (feedback - trace) * Math.exp(-dt / 0.45);

            // Red and cyan drift around each other with the mids and jump apart on kicks
            const split = 0.4 + 1.2 * mid + 4.5 * kick * kick;
            const angle = now / 700;
            const x = Math.cos(angle) * split;
            const y = Math.sin(angle) * split * 0.35;
            el.style.setProperty("--split-x", `${x.toFixed(2)}px`);
            el.style.setProperty("--split-y", `${y.toFixed(2)}px`);

            // Each echo uses where the split was a few frames ago, pushed further out
            history.unshift([x, y]);
            history.length = Math.min(history.length, ECHOES.length * ECHO_DELAY + 1);
            ECHOES.forEach((_, i) => {
                const [ex, ey] = history[Math.min(history.length - 1, (i + 1) * ECHO_DELAY)];
                const spread = 1.5 + i;
                el.style.setProperty(`--echo-${i}-x`, `${(ex * spread).toFixed(2)}px`);
                el.style.setProperty(`--echo-${i}-y`, `${(ey * spread).toFixed(2)}px`);
            });
            el.style.setProperty("--feedback", feedback.toFixed(3));
            el.style.setProperty("--tear", tear > 0.05 ? "1" : "0");
            el.style.setProperty("--tear-shift", `${(tearDirection * tear * 16).toFixed(1)}px`);
        }
        frame = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame);
            reset();
        };
    }, []);

    return (
        <span ref={wrapperRef} className="glitch-logo">
            <img src={src} alt={alt} className={`${className} glitch-logo-base`} />
            {layersLoaded && (
                <>
                    {ECHOES.map((layer, i) => (
                        <img
                            key={i}
                            src={layer}
                            alt=""
                            aria-hidden="true"
                            className={`glitch-logo-layer glitch-logo-echo glitch-logo-echo-${i}`}
                        />
                    ))}
                    <img src={RED_LAYER} alt="" aria-hidden="true" className="glitch-logo-layer glitch-logo-red" />
                    <img src={CYAN_LAYER} alt="" aria-hidden="true" className="glitch-logo-layer glitch-logo-cyan" />
                    <img src={src} alt="" aria-hidden="true" className="glitch-logo-layer glitch-logo-tear" />
                </>
            )}
        </span>
    );
}

export default GlitchLogo;
