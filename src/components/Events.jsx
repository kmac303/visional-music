
import { Link } from "react-router-dom";

function Events() {
    // List of artists
    const artistList = [
        "Valentino Khan", "Midnight Tyrannosaurus", "Sidepiece", "Hol!",  "The Glitch Mob", "Getter", "Maddy O’Neal", 
        "Space Laces", "Jkyl & Hyde", "Wreckno", "Rusko", "Skepsis", "Jon Casey", "Sisto", "OG Nixin", "Benda",
        "Ayybo", "Phutureprimitive", "Lizzy Jane", "DJ Pressed", "Random Rab", "Savej", "Heyz", "David Starfire", 
        "Pauline Herr", "The Sponges", "UZ", "The Gaslamp Killer", "Figure", "DMVU", "Toadface", "Kumarion", "Swampz", 
        "Covex", "Chozen", "Twopercent", "MZG", "Vinnie Maniscalco", "Omas", "Top Brahman", "Noetika", "PapaJay"
    ];

    // List of events (upcoming & past)
    const events = [
        { 
            title: "Sunny Rave Tour w/ DJ Pressed", 
            imgSrc: "/assets/sunnyrave.jpg", 
            alt: "sunnyrave", 
            link: "https://www.sunnyrave.com/tour", 
            category: "past" 
        },
        { 
            title: "Hostage Situation @ Ogden Theatre", 
            imgSrc: "/assets/hostagesituation2.png", 
            alt: "hostagesituation", 
            link: "https://www.ticketmaster.com/hostage-situation-16-and-over-denver-05-09-2026/event/Z7r9jZ1A7--0O", 
            category: "past" 
        },
        { 
            title: "Decadence 2025", 
            imgSrc: "/assets/Decadence2025.jpg", 
            alt: "decadence25", 
            link: "https://decadencenye.com", 
            category: "past" 
        },
        { 
            title: "Desert Dwellers, David Starfire, & Savej @ Cervantes", 
            imgSrc: "/assets/desertdwellers.jpg", 
            alt: "savej", 
            link: "https://blackspymarketing.com/event/desert-dwellers-at-cervantes-masterpiece/", 
            category: "past" 
        },
        { 
            title: "Ayybo @ Ogden Theatre", 
            imgSrc: "/assets/ayybo.jpeg", 
            alt: "ayybo", 
            link: "https://do303.com/events/2025/11/1/ayybo-tickets",
            category: "past" 
        },
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
            title: "Heyz @ Bluebird Theater", 
            imgSrc: "/assets/Heyz.jpg", 
            alt: "heyz", 
            link: "https://www.axs.com/venues/100811/bluebird-theater-denver-tickets",
            category: "past" 
        },
        { 
            title: "Decadence 2024", 
            imgSrc: "/assets/Decadence 24.png", 
            alt: "decadence", 
            link: "https://decadencenye.com", 
            category: "past" 
        },
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
            {/* <h1>UPCOMING EVENTS</h1>
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
            </div> */}

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