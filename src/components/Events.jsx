
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
            title: "Hol!, OG Nixin b2b Benda, & Twopercent at Red Rocks", 
            imgSrc: "/assets/ATLiens.jpg", 
            alt: "atliens", 
            className: "flyer-small",  
            link: "https://www.axs.com/events/836697/atliens-hol-tickets", 
            category: "past" 
        },
        { 
            title: "Ayybo at Civic Center Park", 
            imgSrc: "/assets/Ayybo.webp", 
            alt: "ayybo", 
            className: "flyer-small",  
            category: "past" 
        },
        { 
            title: "Heyz at Bluebird Theater", 
            imgSrc: "/assets/Heyz_Bluebird.jpg", 
            alt: "heyz", 
            className: "flyer-medium", 
            category: "past" 
        },
        { 
            title: "Sunny Rave w/ DJ Pressed", 
            imgSrc: "/assets/Sunny_Rave.png", 
            alt: "sunnyrave", 
            className: "flyer-small", 
            category: "past" 
        },
        { 
            title: "Valentino Khan at The Church", 
            imgSrc: "/assets/VK-Church.jpg", 
            alt: "vk", 
            className: "flyer-medium", 
            category: "past" 
        },
        { 
            title: "Decadence 2024", 
            imgSrc: "/assets/Decadence.jpg", 
            alt: "decadence", 
            className: "flyer-medium", 
            link: "https://decadencenye.com", 
            category: "past" 
        },
        { 
            title: "Secret Dreams 2024", 
            imgSrc: "/assets/Secret Dreams 24.jpg", 
            alt: "secret dreams", 
            className: "flyer-small", 
            link: "https://www.secretdreamsfest.com", 
            category: "past" 
        },
        { 
            title: "Sonic Bloom 2023", 
            imgSrc: "/assets/Sonic Bloom 23.jpg", 
            alt: "sonic bloom", 
            className: "flyer-small", 
            link: "https://sonicbloomfestival.com", 
            category: "past" 
        }
    ];

    return (
        <section>
            <h1>UPCOMING EVENTS</h1>
            <div className="event-text-container">
                {events
                    .filter(event => event.category === "upcoming")
                    .map((event, index) => (
                        <Link key={index} to={event.link} target="_blank" rel="noopener noreferrer">
                            <img src={event.imgSrc} alt={event.alt} className={event.className} />
                            <h3>{event.title}</h3><br />
                        </Link>
                    ))
                }
            </div>

            <h1>PAST EVENTS</h1>
            <div className="event-text-container">
                {events
                    .filter(event => event.category === "past")
                    .map((event, index) => (
                        <Link key={index} to={event.link} target="_blank" rel="noopener noreferrer">
                            <img src={event.imgSrc} alt={event.alt} className={event.className} />
                            <h3>{event.title}</h3><br />
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