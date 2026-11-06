import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaMicrophone } from "react-icons/fa";
import GlitchHeadshot from "./GlitchHeadshot";
import { audioLevels, moshControls } from "./audioLevels";
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

// How fast long track names scroll, in pixels per second
const MARQUEE_SPEED = 20;
// How long the title holds still at the start of each pass, in seconds
const MARQUEE_PAUSE = 2;

// Long track names scroll in a loop like an old MP3 player: hold at the start,
// scroll one full pass, then hold again. Short ones sit still. The text appears
// twice in a row so each pass ends exactly where the next one starts.
function fitMarquee(text) {
    const marquee = text.parentElement;
    const copy = marquee.querySelector(".hud-marquee-copy");
    copy.textContent = text.textContent;
    marquee.getAnimations().forEach((animation) => animation.cancel());
    marquee.classList.remove("is-scrolling");
    const overflow = text.scrollWidth > marquee.parentElement.clientWidth;
    marquee.classList.toggle("is-scrolling", overflow);
    if (overflow) {
        // One full title plus its gap
        const distance = text.getBoundingClientRect().width;
        const scroll = distance / MARQUEE_SPEED;
        const total = MARQUEE_PAUSE + scroll;
        marquee.animate(
            [
                { transform: "translateX(0)" },
                { transform: "translateX(0)", offset: MARQUEE_PAUSE / total },
                { transform: `translateX(${-distance}px)` },
            ],
            { duration: total * 1000, iterations: Infinity },
        );
    }
}

// Square brackets mark the readout controls; screen readers skip them
function Bracket({ children }) {
    return <><span aria-hidden="true">[</span>{children}<span aria-hidden="true">]</span></>;
}

const denverTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
});

// Opening screen: the headshot surrounded by readouts that report the live audio
function Hero() {
    const { mode, message, track, toggleTrack, toggleMic, getTrackPosition, seekTrack } = useSound();
    // True while the visitor is dragging the scrubber, so playback doesn't fight their hand
    const scrubbing = useRef(false);
    const [frozen, setFrozen] = useState(moshControls.freeze);
    const [flow, setFlow] = useState(Math.round(moshControls.flowAmount * 100));
    const changeFlow = (event) => {
        const value = Number(event.currentTarget.value);
        moshControls.flowAmount = value / 100;
        setFlow(value);
    };
    const toggleFreeze = () => {
        moshControls.freeze = !moshControls.freeze;
        setFrozen(moshControls.freeze);
    };
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
            const source = a.source === "track" ? track.title : a.source === "mic" ? "ROOM AUDIO" : "---";
            if (r.source && r.source.textContent !== source) {
                r.source.textContent = source;
                fitMarquee(r.source);
            }
            // A known track tempo beats an estimate from detected hits
            const bpm = a.source === "track" && track?.bpm ? track.bpm : a.bpm;
            write("bpm", on && bpm ? String(bpm).padStart(3, "0") : "---");
            write("bass", meter(on ? a.bass : 0));
            write("mid", meter(on ? a.mid : 0));
            write("high", meter(on ? a.high : 0));
            write("mosh", a.flow.toUpperCase());
            write("hits", String(a.kicks).padStart(4, "0"));
            write("frame", String(a.frame).padStart(6, "0"));
            // Track position shows (and can be scrubbed) once the track has started, even while paused
            const position = a.source === "mic" ? null : getTrackPosition();
            write("time", position ? `${timecode(position.time)} / ${timecode(position.duration)}` : on ? "LIVE INPUT" : "00:00 / --:--");
            if (r.scrubber) {
                const scrubber = r.scrubber;
                scrubber.disabled = !position;
                if (position) {
                    scrubber.max = String(Math.floor(position.duration));
                    if (!scrubbing.current) scrubber.value = String(position.time);
                    scrubber.setAttribute("aria-valuetext", `${timecode(position.time)} of ${timecode(position.duration)}`);
                }
                const progress = position ? (Number(scrubber.value) / position.duration) * 100 : 0;
                scrubber.style.setProperty("--progress", `${progress}%`);
            }
            if (r.signal) r.signal.classList.toggle("is-live", on);
        }

        // Stop updating while the hero is scrolled out of view
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
        });
        observer.observe(heroRef.current);
        frame = requestAnimationFrame(tick);

        // The scroll distance depends on the box width and the loaded font
        const refitSource = () => {
            if (readouts.current.source) fitMarquee(readouts.current.source);
        };
        window.addEventListener("resize", refitSource);
        document.fonts?.ready.then(refitSource);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener("resize", refitSource);
        };
    }, [track, getTrackPosition]);

    return (
        <section id="top" className="hero" ref={heroRef}>
            <div className="hero-panel">
                <div className="hud hud-top-left">
                    {/* Each group stays together, so narrow windows wrap between them */}
                    {/* Says what, not who: the corner logo already names Visional. The name stays in
                        the heading for screen readers and search engines, hidden on screen. */}
                    <h1 className="hud-title">
                        <span className="sr-only">Visional, </span>
                        <span className="hud-nowrap">VJ <span className="hud-dim">//</span></span>{" "}
                        <span className="hud-nowrap">Audio-reactive</span> artist
                    </h1>
                    <div>
                        <span className="hud-nowrap">Denver, CO</span>
                        <span className="hud-nowrap hud-dim hud-optional">39.7392°N 104.9903°W</span>
                    </div>
                    <div className="hud-optional" ref={readout("clock")} />
                </div>

                <dl className="hud hud-top-right">
                    <div><dt>Signal</dt><dd ref={readout("signal")} className="hud-signal">STANDBY</dd></div>
                    <div className="hud-optional"><dt>Input</dt><dd ref={readout("input")}>NONE</dd></div>
                    <div className="hud-optional">
                        <dt>Src</dt>
                        <dd className="hud-source">
                            <span className="hud-marquee">
                                <span ref={readout("source")} className="hud-marquee-text">---</span>
                                <span className="hud-marquee-text hud-marquee-copy" aria-hidden="true" />
                            </span>
                        </dd>
                    </div>
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
                                <button type="button" className="hero-button hero-play" onClick={toggleTrack} aria-label={`Play ${track.title}`}>
                                    <FaPlay aria-hidden="true" /> Play music
                                </button>
                            )}
                            <button type="button" className="hero-button hero-mic" onClick={toggleMic}>
                                <FaMicrophone aria-hidden="true" /> React to mic
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
                    <div>
                        <dt>Flow</dt>
                        <dd className="hud-flow">
                            {/* Looks like the other meters, but an invisible slider sits on top so it
                                can be dragged (or set with the arrow keys) from 100 down to 1 */}
                            <span className="hud-flow-control">
                                <span className="hud-meter" aria-hidden="true">
                                    {"█".repeat(Math.ceil(flow / 10)) + "░".repeat(METER_SEGMENTS - Math.ceil(flow / 10))}
                                </span>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    step="1"
                                    value={flow}
                                    onChange={changeFlow}
                                    aria-label="Flow amount"
                                    aria-valuetext={`${flow}%`}
                                    title="Drag to set how strongly the sound moves the background"
                                />
                            </span>{" "}
                            <span>{flow}%</span>
                        </dd>
                    </div>
                    {/* Each readout here comes with a control for the background */}
                    <div>
                        <dt>Mosh</dt>
                        <dd>
                            <span ref={readout("mosh")}>HOLD</span>{" "}
                            <button type="button" className="hud-action" onClick={toggleFreeze} aria-pressed={frozen} title="Hold the background still while the sound plays">
                                <Bracket>{frozen ? "Resume" : "Freeze"}</Bracket>
                            </button>
                        </dd>
                    </div>
                    <div>
                        <dt>Hits</dt>
                        <dd>
                            <span ref={readout("hits")}>0000</span>{" "}
                            <button type="button" className="hud-action" onClick={() => { moshControls.hitRequests += 1; }} title="Fire a hit into the background">
                                <Bracket>Hit</Bracket>
                            </button>
                        </dd>
                    </div>
                    <div>
                        <dt>Frame</dt>
                        <dd>
                            <span ref={readout("frame")}>000000</span>{" "}
                            <button type="button" className="hud-action" onClick={() => { moshControls.clearRequests += 1; }} title="Wipe the background back to a clean frame">
                                <Bracket>Clear</Bracket>
                            </button>
                        </dd>
                    </div>
                </dl>

                <div className="hud hud-timeline">
                    <span ref={readout("time")}>00:00 / --:--</span>
                    <input
                        ref={readout("scrubber")}
                        type="range"
                        className="hud-scrubber"
                        min="0"
                        max="0"
                        step="1"
                        defaultValue="0"
                        disabled
                        aria-label="Track position"
                        onPointerDown={() => { scrubbing.current = true; }}
                        onPointerUp={() => { scrubbing.current = false; }}
                        onPointerCancel={() => { scrubbing.current = false; }}
                        onInput={(event) => seekTrack(Number(event.currentTarget.value))}
                    />
                    <Link to="/about" className="hud-scroll">▼ Scroll</Link>
                </div>
            </div>
        </section>
    );
}

export default Hero;
