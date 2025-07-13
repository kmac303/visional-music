
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
            title: "7/15 - Droptalk @ The Black Box", 
            imgSrc: "/assets/Droptalk.png", 
            alt: "droptalk", 
            link: "https://events.blackboxdenver.co/e/etuesdays-july15/tickets", 
            category: "upcoming" 
        },
        { 
            title: "7/17 - Chozen @ Larimer Lounge", 
            imgSrc: "/assets/Chozen.png", 
            alt: "chozen", 
            link: "https://larimerlounge.com/event/wakaan-debut-ep-release-party-feat-chozen-w-mindsplitter-aeye-costa/larimer-lounge/denver-colorado/", 
            category: "upcoming" 
        },
        { 
            title: "Portal Dome Macrodose Throwdown", 
            imgSrc: "/assets/PortalDome.jpeg", 
            alt: "portaldome", 
            link: "https://youaretheportal.com/events/portal-dome-macrodose-throwdown/", 
            category: "past" 
        },
        { 
            title: "Porangui & Savej @ Cervantes Masterpiece Ballrooom", 
            imgSrc: "/assets/Savej.jpg", 
            alt: "savej", 
            link: "https://cervantesmasterpiece.com/event/maps-kickoff-party-hosted-by-tandava-with-poranguí-savej/cervantes-masterpiece-ballroom/denver-colorado/", 
            category: "past" 
        },
        { 
            title: "Hol!, OG Nixin b2b Benda, & Twopercent at Red Rocks", 
            imgSrc: "/assets/ATLiens.jpg", 
            alt: "atliens", 
            link: "https://www.axs.com/events/836697/atliens-hol-tickets", 
            category: "past" 
        },
        { 
            title: "Ayybo at Civic Center Park", 
            imgSrc: "/assets/Ayybo.webp", 
            alt: "ayybo", 
            link: "https://civiccenterpark.org/event/dom-dolla",
            category: "past" 
        },
        { 
            title: "Heyz at Bluebird Theater", 
            imgSrc: "/assets/Heyz_Bluebird.jpg", 
            alt: "heyz", 
            link: "https://www.axs.com/venues/100811/bluebird-theater-denver-tickets",
            category: "past" 
        },
        { 
            title: "Sunny Rave w/ DJ Pressed", 
            imgSrc: "/assets/Sunny_Rave.png", 
            alt: "sunnyrave", 
            link: "https://www.sunnyrave.com/tour",
            category: "past" 
        },
        { 
            title: "Valentino Khan at The Church", 
            imgSrc: "/assets/VK-Church.jpg", 
            alt: "vk", 
            link: "https://churchnightclubco.com/event/valentino-khan-upcoming-edm-shows-nightlife-concerts-events-tonight-tomorrow-2025-apr-11-best-nightclub-near-me-denver-co",
            category: "past" 
        },
        { 
            title: "Decadence 2024", 
            imgSrc: "/assets/Decadence.jpg", 
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