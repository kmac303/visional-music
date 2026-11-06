import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const bio = [
    "Visional is the visual project of Kevin McIntosh — a self-taught VJ and multimedia artist who brings music to life through immersive audio-reactive concert visuals (what you see on the screen).",
    "His journey began during the pandemic, providing weekly live visuals for a Twitch DJ collective - a formative experience that helped him develop a unique visual style across a wide range of music genres, shaped by experimenting with audio-reactivity and custom camera effects in real-time.",
    "Drawing from his background as a music producer and DJ, Visional approaches visual performances with a deep understanding of musical flow, song structure, and crowd energy.",
    "Since bringing his work to the live concert space, he's delivered live visuals at iconic venues like Red Rocks, Legend Valley, and Burning Man — translating sound into unforgettable visual journeys, one set at a time. 👁️‍🗨️",
];

const testimonials = [
    {
        name: "Heyz",
        link: "https://www.heyzmusic.com",
        image: "/assets/Heyz Headshot.jpg",
        quote: "With a rare musical intuition, Kevin knows exactly when to push the energy visually and when to pull back. His timing is always spot-on.",
    },
    {
        name: "DJ Pressed",
        link: "https://www.instagram.com/djpressed/",
        image: "/assets/DJ Pressed Headshot.jpg",
        quote: "Kevin has been instrumental in preparing and executing complex, time-coded sets. He's prepared for every variable, including translating the ramblings of a delusional artist with outrageous expectations.",
    },
    {
        name: "Savej",
        link: "https://www.savejmusic.com",
        image: "/assets/Savej Headshot.webp",
        quote: "Every VJ I’ve shared my custom Resolume composition with has been blown away — Kevin’s work on creating this is next-level and deeply appreciated.",
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
    return (
        <section id="about" className="page-section about-section">
            <SectionHeader index="01" label="About" title="Who is Visional?" />
            <div className="bio">
                {bio.map((paragraph, index) => (
                    <motion.p key={index} {...reveal}>
                        <span className="bio-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                        {paragraph}
                    </motion.p>
                ))}
            </div>

            <SectionHeader index="01.1" label="Testimonials" title="What artists say" />
            <div className="transmissions">
                {testimonials.map((testimonial, index) => (
                    <motion.figure key={testimonial.name} className="transmission" {...reveal}>
                        {/* The artist's photo fills the card; a dark fade at the bottom keeps the quote readable */}
                        <img className="transmission-photo" src={testimonial.image} alt={testimonial.name} loading="lazy" />
                        <div className="hud-label">
                            Transmission {String(index + 1).padStart(2, "0")} // {testimonial.name}
                        </div>
                        <blockquote>“{testimonial.quote}”</blockquote>
                        <figcaption>
                            <a href={testimonial.link} target="_blank" rel="noopener noreferrer">
                                — {testimonial.name}
                            </a>
                        </figcaption>
                    </motion.figure>
                ))}
            </div>
        </section>
    );
}

export default About;
