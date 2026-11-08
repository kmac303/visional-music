import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaPause, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useSound } from "./AudioBackground";

const SECTIONS = [
    { id: "top", label: "Index", to: "/" },
    { id: "about", label: "About", to: "/about" },
    { id: "events", label: "Events", to: "/events" },
    { id: "gallery", label: "Gallery", to: "/gallery" },
    { id: "contact", label: "Contact", to: "/contact" },
];

const denverClock = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
});

// Fixed bar along the bottom, like the transport bar in VJ software
function HudBar() {
    const { mode, track, toggleTrack, toggleMic } = useSound();
    const [active, setActive] = useState(0);
    const clockRef = useRef(null);

    // Highlight whichever section is crossing the middle of the screen
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(SECTIONS.findIndex((section) => section.id === entry.target.id));
                    }
                });
            },
            { rootMargin: "-45% 0px -50% 0px" }
        );
        SECTIONS.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        // The last section can be shorter than a tall screen and never reach the middle, so
        // highlight it whenever the page is scrolled all the way down
        const handleScroll = () => {
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
            if (atBottom) setActive(SECTIONS.length - 1);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const update = () => {
            if (clockRef.current) clockRef.current.textContent = `MT ${denverClock.format(new Date())}`;
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, []);

    const current = SECTIONS[Math.max(0, active)];

    return (
        <nav className="hud-bar" aria-label="Sections">
            <ul className="hud-bar-links">
                {SECTIONS.map((section, index) => (
                    <li key={section.id}>
                        <Link
                            to={section.to}
                            className={index === active ? "is-active" : undefined}
                            aria-current={index === active ? "true" : undefined}
                        >
                            {section.label} +
                        </Link>
                    </li>
                ))}
            </ul>
            <span className="hud-bar-current" aria-hidden="true">
                {String(Math.max(0, active)).padStart(2, "0")} // {current.label}
            </span>

            <div className="hud-bar-audio">
                {track && (
                    <button
                        type="button"
                        onClick={toggleTrack}
                        aria-pressed={mode === "track"}
                        aria-label={mode === "track" ? "Pause track" : `Play ${track.spokenTitle || track.title}`}
                        title={track.title}
                    >
                        {mode === "track" ? <FaPause aria-hidden="true" /> : <FaPlay aria-hidden="true" />}
                        <span>{mode === "track" ? "Pause" : "Play"}</span>
                    </button>
                )}
                <button
                    type="button"
                    onClick={toggleMic}
                    aria-pressed={mode === "mic"}
                    aria-label={mode === "mic" ? "Stop microphone" : "Make the background react to your microphone"}
                >
                    {mode === "mic" ? <FaMicrophoneSlash aria-hidden="true" /> : <FaMicrophone aria-hidden="true" />}
                    <span>Mic</span>
                </button>
            </div>

            <span className="hud-bar-clock" ref={clockRef} />
            {/* Goes to the Contact section, where the email is revealed on click */}
            <Link className="hud-bar-book" to="/contact">Book a set +</Link>
        </nav>
    );
}

export default HudBar;
