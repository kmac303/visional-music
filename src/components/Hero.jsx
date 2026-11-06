import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaMicrophone } from "react-icons/fa";
import GlitchHeadshot from "./GlitchHeadshot";
import { audioLevels } from "./audioLevels";
import { useSound } from "./AudioBackground";

const METER_SEGMENTS = 10;

function meter(value) {
    const lit = Math.round(Math.min(1, Math.max(0, value)) * METER_SEGMENTS);
    return "█".repeat(lit) + "░".repeat(METER_SEGMENTS - lit);
}

function timecode(seconds) {
    const whole = Math.max(0, Math.floor(seconds || 0));
    return `${String(Math.floor(whole / 60)).padStart(2, "0")}:${String(whole % 60).padStart(2, "0")}`;
}

const denverTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
});

// Opening screen: the headshot surrounded by readouts that report the live audio
function Hero() {
    const { mode, message, track, toggleTrack, toggleMic } = useSound();
    const heroRef = useRef(null);
    const readouts = useRef({});
    const readout = (key) => (element) => {
        readouts.current[key] = element;
    };

    useEffect(() => {
        let frame;
        let last = 0;
        let visible = true;

        // Writes straight to the page instead of re-rendering React; about 15 updates
        // a second is plenty for text readouts
        function tick(now) {
            frame = requestAnimationFrame(tick);
            if (!visible || now - last < 66) return;
            last = now;

            const r = readouts.current;
            const a = audioLevels;
            const write = (key, text) => {
                if (r[key] && r[key].textContent !== text) r[key].textContent = text;
            };
            const on = a.playing;

            write("clock", `${denverTime.format(new Date())} MT`);
            write("signal", on ? "● LIVE" : "STANDBY");
            write("input", on ? a.source.toUpperCase() : "NONE");
            write("source", a.source === "track" ? track.title : a.source === "mic" ? "ROOM AUDIO" : "—");
            write("bpm", on && a.bpm ? String(a.bpm).padStart(3, "0") : "---");
            write("bass", meter(on ? a.bass : 0));
            write("mid", meter(on ? a.mid : 0));
            write("high", meter(on ? a.high : 0));
            write("flowBar", meter(on ? a.presence : 0));
            write("flowValue", `${Math.round((on ? a.presence : 0) * 100)}%`);
            write("mosh", a.flow.toUpperCase());
            write("hits", String(a.kicks).padStart(4, "0"));
            write("frame", String(a.frame).padStart(6, "0"));
            write("time", a.duration ? `${timecode(a.time)} / ${timecode(a.duration)}` : on ? "LIVE INPUT" : "00:00 / --:--");
            if (r.progress) {
                r.progress.style.transform = `scaleX(${a.duration ? a.time / a.duration : 0})`;
            }
            if (r.signal) r.signal.classList.toggle("is-live", on);
        }

        // Stop updating while the hero is scrolled out of view
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
        });
        observer.observe(heroRef.current);
        frame = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, [track]);

    return (
        <section id="top" className="hero" ref={heroRef}>
            <div className="hud hud-top-left">
                <h1 className="hud-title">
                    Visional <span className="hud-dim">//</span> VJ <span className="hud-dim hud-optional">//</span>{" "}
                    <span className="hud-optional">Audio-reactive artist</span>
                </h1>
                <div>
                    Denver, CO <span className="hud-dim hud-optional">39.7392°N 104.9903°W</span>
                </div>
                <div className="hud-optional" ref={readout("clock")} />
            </div>

            <dl className="hud hud-top-right">
                <div><dt>Signal</dt><dd ref={readout("signal")} className="hud-signal">STANDBY</dd></div>
                <div className="hud-optional"><dt>Input</dt><dd ref={readout("input")}>NONE</dd></div>
                <div className="hud-optional"><dt>Src</dt><dd ref={readout("source")} className="hud-source">—</dd></div>
            </dl>

            <div className="hero-center">
                <div className="hero-target">
                    <GlitchHeadshot className="hero-headshot" />
                    <span className="target-corner target-corner-tl" aria-hidden="true" />
                    <span className="target-corner target-corner-tr" aria-hidden="true" />
                    <span className="target-corner target-corner-bl" aria-hidden="true" />
                    <span className="target-corner target-corner-br" aria-hidden="true" />
                    <span className="hud-label target-label target-label-top" aria-hidden="true">Subject // Visional</span>
                    <span className="hud-label target-label target-label-bottom" aria-hidden="true">Kevin McIntosh // Ref 0001</span>
                </div>
                {mode === "off" && (
                    <div className="hero-start">
                        {track && (
                            <button type="button" className="hero-play" onClick={toggleTrack} aria-label={`Play ${track.title}`}>
                                <FaPlay aria-hidden="true" /> Play
                            </button>
                        )}
                        <button type="button" className="hero-mic" onClick={toggleMic}>
                            <FaMicrophone aria-hidden="true" /> or react to your mic
                        </button>
                    </div>
                )}
                {message && <p className="hud-message" role="status">{message}</p>}
                {mode === "mic" && <p className="hud-message">Mic audio stays on your device</p>}
            </div>

            <dl className="hud hud-bottom-left">
                <div><dt>BPM</dt><dd ref={readout("bpm")}>---</dd></div>
                <div><dt>Bass</dt><dd ref={readout("bass")} className="hud-meter">{meter(0)}</dd></div>
                <div className="hud-optional"><dt>Mid</dt><dd ref={readout("mid")} className="hud-meter">{meter(0)}</dd></div>
                <div className="hud-optional"><dt>High</dt><dd ref={readout("high")} className="hud-meter">{meter(0)}</dd></div>
            </dl>

            <dl className="hud hud-bottom-right hud-optional">
                <div><dt>Flow</dt><dd><span ref={readout("flowBar")} className="hud-meter">{meter(0)}</span> <span ref={readout("flowValue")}>0%</span></dd></div>
                <div><dt>Mosh</dt><dd ref={readout("mosh")}>HOLD</dd></div>
                <div><dt>Hits</dt><dd ref={readout("hits")}>0000</dd></div>
                <div><dt>Frame</dt><dd ref={readout("frame")}>000000</dd></div>
            </dl>

            <div className="hud hud-timeline">
                <span ref={readout("time")}>00:00 / --:--</span>
                <span className="hud-progress" aria-hidden="true"><span ref={readout("progress")} /></span>
                <Link to="/about" className="hud-scroll">▼ Scroll</Link>
            </div>
        </section>
    );
}

export default Hero;
