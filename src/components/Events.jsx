import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

function Events() {
    // List of artists
    const artistList = [
        "The Glitch Mob", "DJ Diesel (Shaq)", "Netsky", "Maddy O’Neal", "Getter", "Shipwrek", "Wuki", "Noizu", "Hol!", "Sidepiece",
        "Jkyl & Hyde", "Wreckno", "Rusko", "Valentino Khan", "Space Laces", "WonkyWilla", "MC4D", "Ayybo", "Bear Grillz", "Sisto", "Lizzy Jane", "Desert Dwellers", "Tynan", "DJ Pressed", "Savej", "Midnight Tyrannosaurus", "Heyz", "David Starfire", "Kumarion", "Pretty Sweet", "Green Matter", "Hostage Situation", "Phutureprimitive", "PapaJay",
        "Purple Disco Machine", "Coco & Breezy", "Swimming Paul", "Jon Casey", "Skepsis", "Hills", "Bolo", "OG Nixin", "Benda", "Random Rab", "Pauline Herr", "The Sponges", "UZ", "The Gaslamp Killer", "Figure", "DMVU", "Swampz", "Covex", "Chozen", "Tsu Nami", "Twopercent", "Toadface", "Habitaat", "Omas", "Noetika", "Dela Moon", "MFinity", "Lil Fish", "Decker Rush", "Nyrus", "MZG", "Vinnie Maniscalco", "Bruer"
    ];

    // List of events (upcoming & past)
    const events = [
        { 
            title: "Decadence 2026", 
            imgSrc: "/assets/Decadence CO 2026.jpg", 
            alt: "decadence2026", 
            link: "https://decadencenye.com", 
            category: "upcoming" 
        },
        { 
            title: "WonkyWilla - Lost Lands 2026", 
            imgSrc: "/assets/Lost Lands 2026.jpeg", 
            alt: "lostlands2026", 
            link: "https://www.lostlandsfestival.com", 
            category: "past" 
        },
        { 
            title: "Global Dance Fest 2026", 
            imgSrc: "/assets/GDF 2026.jpg", 
            alt: "gdf2026", 
            link: "https://globaldancefestival.com", 
            category: "past" 
        },
        // { 
        //     title: "Tynan - Denver", 
        //     imgSrc: "/assets/Tynan Denver 2026.jpeg", 
        //     alt: "tynandenver", 
        //     link: "https://www.ticketmaster.com/tynan-16-and-over-denver-09-05-2026/event/Z7r9jZ1A7JeGV", 
        //     category: "past" 
        // },
        // { 
        //     title: "Bear Grillz - Denver", 
        //     imgSrc: "/assets/Bear Grillz Summit Denver.png", 
        //     alt: "beargrillzsummit", 
        //     link: "https://www.insomniac.com/events/bear-grillz-2026-08-22-denver-co/", 
        //     category: "past" 
        // },
        { 
            title: "DJ Diesel - Vancouver, BC", 
            imgSrc: "/assets/Diesel Harbour Vancouver.jpeg", 
            alt: "dieselvancouver", 
            link: "https://www.insomniac.com/events/dj-diesel-2026-08-21-vancouver-bc/", 
            category: "past" 
        },
        // { 
        //     title: "DJ Diesel - Fresno", 
        //     imgSrc: "/assets/Diesel FW Fresno.jpeg", 
        //     alt: "dieselfresno", 
        //     link: "https://foamwonderland.com", 
        //     category: "past" 
        // },
        { 
            title: "Sunny Rave tour w/ DJ Pressed", 
            imgSrc: "/assets/sunnyrave.jpg", 
            alt: "sunnyrave", 
            link: "https://www.sunnyrave.com/tour", 
            category: "past" 
        },
        { 
            title: "Decadence 2025", 
            imgSrc: "/assets/Decadence2025.jpg", 
            alt: "decadence25", 
            link: "https://decadencenye.com", 
            category: "past" 
        },
        // { 
        //     title: "Desert Dwellers, David Starfire, & Savej - Denver", 
        //     imgSrc: "/assets/desertdwellers.jpg", 
        //     alt: "savej", 
        //     link: "https://blackspymarketing.com/event/desert-dwellers-at-cervantes-masterpiece/", 
        //     category: "past" 
        // },
        { 
            title: "Portal Dome Macrodose Throwdown", 
            imgSrc: "/assets/PortalDome.jpeg", 
            alt: "portaldome", 
            link: "https://youaretheportal.com/events/portal-dome-macrodose-throwdown/", 
            category: "past" 
        },
        // { 
        //     title: "Hol!, OG Nixin b2b Benda, & Twopercent @ Red Rocks", 
        //     imgSrc: "/assets/ATLiens.jpg", 
        //     alt: "atliens", 
        //     link: "https://www.axs.com/events/836697/atliens-hol-tickets", 
        //     category: "past" 
        // },
        {
            title: "Secret Dreams 2024",
            imgSrc: "/assets/Secret Dreams 24.jpg", 
            alt: "secret dreams", 
            link: "https://www.secretdreamsfest.com", 
            category: "past" 
        },
        { 
            title: "Sonic Bloom 2023", 
            imgSrc: "/assets/Sonic Bloom 23.jpg", 
            alt: "sonic bloom", 
            link: "https://sonicbloomfestival.com", 
            category: "past" 
        }
    ];

    const upcoming = events.filter((event) => event.category === "upcoming");
    const past = events.filter((event) => event.category === "past");

    const card = (event, index) => (
        <motion.a
            key={event.title}
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="event-card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: (index % 2) * 0.08 }}
        >
            <img src={event.imgSrc} alt={event.alt} loading="lazy" />
            <span className="event-card-caption">
                <span className="hud-label">{String(index + 1).padStart(4, "0")}</span>
                <span className="event-card-title">{event.title}</span>
            </span>
        </motion.a>
    );

    return (
        <section id="events" className="page-section events-section">
            <SectionHeader index="02" label="Events" title="Where the visuals have been" />
            {upcoming.length > 0 && (
                <>
                    <div className="hud-label events-group-label">Upcoming // {upcoming.length}</div>
                    <div className="event-cards">{upcoming.map(card)}</div>
                </>
            )}
            <div className="hud-label events-group-label">Past // {past.length}</div>
            <div className="event-cards">{past.map(card)}</div>

            <div className="hud-label events-group-label">Artists Visional has worked with // {artistList.length}</div>
            <ul className="artist-cloud">
                {artistList.map((artist, index) => (
                    <li key={index}>{artist}</li>
                ))}
            </ul>
        </section>
    );
}

export default Events;