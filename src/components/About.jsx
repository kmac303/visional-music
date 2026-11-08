import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const bio = [
    "Visional is the visual project of Kevin McIntosh, a self-taught VJ and multimedia artist who brings music to life through immersive audio-reactive concert visuals (what you see on the screen).",
    "His journey began during the pandemic, providing weekly live visuals for a Twitch DJ collective - a formative experience that helped him develop a unique visual style across a wide range of music genres, shaped by experimenting with audio-reactivity and custom camera effects in real-time.",
    "Drawing from his background as a music producer and DJ, Visional approaches visual performances with a deep understanding of musical flow, song structure, and crowd energy.",
    "Since bringing his work to the live concert space, he's delivered live visuals at iconic venues like Red Rocks, Legend Valley, and Burning Man, translating sound into unforgettable visual journeys, one set at a time. 👁️‍🗨️",
];

// Stage photos shown beside the bio
const stages = [
    {
        venue: "Fiddler's Green Amphitheatre",
        image: "/assets/Stage Mile High.jpg",
        alt: "Visional's halftone glitch visuals on the LED walls at Fiddler's Green Amphitheatre, framed by red light columns and lasers over the crowd",
    },
    {
        venue: "Lost Lands",
        image: "/assets/Stage Lost Lands.jpg",
        alt: "Visional's visuals for WonkyWilla across the giant LED walls of the Lost Lands main stage in daylight, with a crowd in front",
    },
];

const testimonials = [
    {
        name: "Heyz",
        link: "https://www.heyzmusic.com",
        image: "/assets/Heyz Headshot.jpg",
        showFullPhoto: true,
        quote: "With a rare musical intuition, Kevin knows exactly when to push the energy visually and when to pull back. His timing is always spot-on.",
    },
    {
        name: "DJ Pressed",
        link: "https://www.instagram.com/djpressed/",
        image: "/assets/DJ Pressed Headshot.jpg",
        // Square photo: show all of it instead of cropping the sides to fill the card
        showFullPhoto: true,
        quote: "Kevin has been instrumental in preparing and executing complex, time-coded sets. He's prepared for every variable, including translating the ramblings of a delusional artist with outrageous expectations.",
    },
    {
        name: "Savej",
        link: "https://www.savejmusic.com",
        image: "/assets/Savej Live.jpg",
        showFullPhoto: true,
        quote: "Every VJ I’ve shared my custom Resolume composition with has been blown away. Kevin’s work on creating this is next-level and deeply appreciated.",
    },
];

// Fades each block in as it scrolls into view
const reveal = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10% 0px" },
    transition: { duration: 0.6, ease: "easeOut" },
};

function About() {
    // Which stage photo is open full screen, if any
    const [openStage, setOpenStage] = useState(null);
    const viewer = useRef(null);

    useEffect(() => {
        if (openStage !== null && !viewer.current.open) viewer.current.showModal();
    }, [openStage]);

    const stage = openStage !== null ? stages[openStage] : null;

    return (
        <section id="about" className="page-section about-section">
            <SectionHeader index="01" label="README.txt" title="Who is Visional?" />
            <div className="about-intro">
                <div className="bio">
                    {bio.map((paragraph, index) => (
                        <motion.p key={index} {...reveal}>
                            <span className="bio-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                            {paragraph}
                        </motion.p>
                    ))}
                </div>
                <div className="bio-stages">
                    {stages.map((stage, index) => (
                        <motion.figure key={stage.image} className="bio-stage" {...reveal}>
                            <button type="button" className="bio-stage-open" onClick={() => setOpenStage(index)} aria-label={`Enlarge photo: ${stage.venue}`}>
                                <img src={stage.image} alt={stage.alt} loading="lazy" />
                            </button>
                            <span className="target-corner target-corner-tl" aria-hidden="true" />
                            <span className="target-corner target-corner-tr" aria-hidden="true" />
                            <span className="target-corner target-corner-bl" aria-hidden="true" />
                            <span className="target-corner target-corner-br" aria-hidden="true" />
                            <figcaption className="hud-label" aria-hidden="true">
                                [{String(index + 1).padStart(2, "0")}] // {stage.venue}
                            </figcaption>
                        </motion.figure>
                    ))}
                </div>
            </div>

            {/* Full-screen view of a stage photo; Escape, the Close button, or a click anywhere closes it */}
            <dialog ref={viewer} className="stage-viewer" onClose={() => setOpenStage(null)} onClick={() => viewer.current.close()} aria-label={stage ? stage.venue : "Stage photo"}>
                {stage && (
                    <>
                        <img src={stage.image} alt={stage.alt} />
                        <div className="stage-viewer-bar">
                            <span className="hud-label">[{String(openStage + 1).padStart(2, "0")}] // {stage.venue}</span>
                            <button type="button" className="stage-viewer-close" onClick={() => viewer.current.close()}>
                                Close ×
                            </button>
                        </div>
                    </>
                )}
            </dialog>

            <SectionHeader index="01.1" label="incoming_transmissions" title="What artists say" />
            <div className="transmissions">
                {testimonials.map((testimonial, index) => (
                    <motion.figure key={testimonial.name} className="transmission" {...reveal}>
                        {/* The artist's photo fills the card; a dark fade at the bottom keeps the quote readable.
                            A full photo sits at the top over a blurred copy that fills the rest of the card. */}
                        {testimonial.showFullPhoto && (
                            <img className="transmission-photo transmission-photo-blur" src={testimonial.image} alt="" aria-hidden="true" loading="lazy" />
                        )}
                        <img
                            className={`transmission-photo${testimonial.showFullPhoto ? " transmission-photo-full" : ""}`}
                            src={testimonial.image}
                            alt={testimonial.name}
                            loading="lazy"
                        />
                        <div className="hud-label">
                            Transmission {String(index + 1).padStart(2, "0")} // {testimonial.name}
                        </div>
                        <blockquote>“{testimonial.quote}”</blockquote>
                        <figcaption>
                            <a href={testimonial.link} target="_blank" rel="noopener noreferrer">
                                {"// "}{testimonial.name}
                            </a>
                        </figcaption>
                    </motion.figure>
                ))}
            </div>
        </section>
    );
}

export default About;
