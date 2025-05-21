
import { Link } from "react-router-dom";

function Events() {
    // List of artists
    const artistList = [
        "Valentino Khan", "Midnight Tyrannosaurus", "Getter", "Space Laces", "Hol!", "Jkyl & Hyde", "Sidepiece", 
        "The Glitch Mob", "Wreckno", "Rusko", "Skepsis", "Maddy O’Neal", "Jon Casey", "Sisto", "OG Nixin", "Benda",
         "Ayybo", "Phutureprimitive", "DJ Pressed", "Random Rab", "Lizzy Jane", "Savej", "David Starfire", 
        "Dela Moon", "Pauline Herr", "Heyz", "The Sponges", "UZ", "The Gaslamp Killer", "Figure", 
        "DMVU", "Toadface", "Kumarion", "Swampz", "Covex", "Chozen", "Twopercent", "MZG", "Omas", "Miilk", "Top Brahman", 
        "CJ.", "Owie", "Noetika", "Papajay"
    ];

    // List of events (upcoming & past)
    const events = [
        { 
            title: "PhatJazz at Mission Ballroom", 
            imgSrc: "/assets/Phatjazz Mission.jpg", 
            alt: "phatjazz", 
            link: "https://www.axs.com/au/events/718028/malaa-tickets", 
            category: "upcoming" 
        },
        { 
            title: "PapaJay & Thresh at Larimer Lounge", 
            imgSrc: "/assets/Thresh.jpg", 
            alt: "thresh", 
            link: "https://larimerlounge.com/event/avello-w-papajay-b2b-spoone-thresh-sam-burt/larimer-lounge/denver-colorado/", 
            category: "upcoming" 
        },
        // { 
        //     title: "Savej at Cervantes Masterpiece Ballrooom", 
        //     imgSrc: "/assets/Savej.png", 
        //     alt: "savej", 
        //     link: "https://cervantesmasterpiece.com/event/maps-kickoff-party-hosted-by-tandava-with-poranguí-savej/cervantes-masterpiece-ballroom/denver-colorado/", 
        //     category: "upcoming" 
        // },
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
                        <Link key={index} to={event.link} target="_blank" rel="noopener noreferrer">
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