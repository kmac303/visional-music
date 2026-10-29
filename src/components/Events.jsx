
import { Link } from "react-router-dom";

function Events() {
    // List of artists
    const artistList = [
        "DJ Diesel (Shaq)", "Valentino Khan", "Noizu", "Shipwrek", "Sidepiece", "Hol!", "Wuki", "The Glitch Mob", "Getter", "Maddy O’Neal", 
        "Space Laces", "Jkyl & Hyde", "Wreckno", "Rusko", "Skepsis", "Jon Casey", "Desert Dwellers", "Midnight Tyrannosaurus", "Sisto", "Hills", "Bolo", "OG Nixin", "Benda", "Tynan",
        "Ayybo", "Bear Grillz", "Phutureprimitive", "Lizzy Jane", "DJ Pressed", "Random Rab", "Savej", "Heyz", "David Starfire", 
        "Pauline Herr", "The Sponges", "UZ", "The Gaslamp Killer", "Figure", "DMVU", "Toadface", "Kumarion", "Pretty Sweet", "Green Matter", "Hostage Situation", "Swampz", 
        "Covex", "Chozen", "Twopercent", "Omas", "Tsu Nami", "Noetika", "PapaJay", "Vinnie Maniscalco", "Top Brahman", "Lil Fish", "Bruer", "MZG"
    ];

    // List of events (upcoming & past)
    const events = [
        { 
            title: "MC4D - Denver", 
            imgSrc: "/assets/MC4D Haunted Mansion Denver.jpeg", 
            alt: "mc4ddenver", 
            link: "https://www.ticketmaster.com/haunted-mansion-feat-loud-luxury-bryce-denver-colorado-10-30-2026/event/1E006514B88DDC53", 
            category: "upcoming" 
        },
        { 
            title: "Drive Theory - Denver", 
            imgSrc: "/assets/Drive Theory OH 2026.jpeg", 
            alt: "drivetheorydenver", 
            link: "https://larimerlounge.com/event/open-house-feat-drive-theory-mirz-speedy-jd-luke-west/larimer-lounge/denver-colorado/", 
            category: "upcoming" 
        },
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

    return (
        <section>
            <h1>UPCOMING EVENTS</h1>
            <div className="event-grid">
                {events
                    .filter(event => event.category === "upcoming")
                    .map((event, index) => (
                        <Link key={index} to={event.link} target="_blank" rel="noopener noreferrer"
                        className={`${event.title.includes("Big") ? "centered-event" : ""}`}>
                            <img src={event.imgSrc} alt={event.alt} className={event.className} />
                            <h4>{event.title}</h4><br />
                        </Link>
                    ))
                }
            </div>
            <h1>PAST EVENTS</h1>
            <div className="event-grid">
                {events
                    .filter(event => event.category === "past")
                    .map((event, index) => (
                        <Link key={index} to={event.link} target="_blank" rel="noopener noreferrer">
                            <img src={event.imgSrc} alt={event.alt} className={event.className} />
                            <h4>{event.title}</h4><br />
                        </Link>
                    ))
                }
            </div>

            <h1>Artists Visional Has Worked With</h1>
            <ul className="artist-list">
                {artistList.map((artist, index) => (
                    <li key={index}>{artist}</li>
                ))}
            </ul>
        </section>
    );
};

export default Events;