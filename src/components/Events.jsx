
import { Link } from "react-router-dom";

function Events() {
    // List of artists
    const artistList = [
        "Valentino Khan", "Midnight Tyrannosaurus", "Getter", "Space Laces", "Jkyl & Hyde", "Sidepiece", 
        "The Glitch Mob", "Wreckno", "Skepsis", "Maddy O’Neal", "Jon Casey", "Sisto", 
        "Rusko", "Phutureprimitive","Random Rab", "Lizzy Jane", "Savej", "David Starfire", 
        "Dela Moon", "Pauline Herr", "Heyz", "The Sponges", "UZ", "The Gaslamp Killer", 
        "Figure", "DMVU", "Toadface", "Kumarion", "Paws", "Bloomurian", "Swampz", "Covex", "Chozen", "Motifv", 
        "MZG", "Omas", "Chance Meridian", "Miilk", "Top Brahman", "Naughty Princess", "CJ.", "Owie", "Noetika", 
        "Kyral x Banko", "Londen Summers", "Chuck Shadow", "Bass Temple", "CRL CRRLL", "Vinnie", "Decker Rush", "Shady Jones"
    ];

    // List of events (upcoming & past)
    const events = [
        { 
            title: "Valentino Khan at The Church", 
            imgSrc: "/assets/VK-Church.jpg", 
            alt: "vk", 
            className: "flyer-medium", 
            link: "https://www.ticketweb.com/event/ritual-fridays-ft-valentino-khan-the-church-nightclub-tickets/14155733", 
            category: "upcoming" 
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
            className: "flyer", 
            link: "https://www.secretdreamsfest.com", 
            category: "past" 
        },
        { 
            title: "Sonic Bloom 2023", 
            imgSrc: "/assets/Sonic Bloom 23.jpg", 
            alt: "sonic bloom", 
            className: "flyer", 
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