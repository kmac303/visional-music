import { Link } from "react-router-dom";
// import decadence from "/public/assets/Decadence.jpg";
// import secretDreams from "/public/assets/Secret Dreams 24.jpg";
// import sonicBloom from "/public/assets/Sonic Bloom 23.jpg";
// import phatjazz from "/public/assets/PhatJazz-Ogden.jpg";
// import driveTheory from "/public/assets/Drive Theory-Mission.jpg";
// import vk from "/public/assets/VK-Church.jpg";

function Events() {

    const artistList = ["Midnight Tyrannosaurus", "Jkyl & Hyde", "Valentino Khan", "Getter", "Space Laces",
    "Sidepiece", "Maddy O’Neal", "Jon Casey", "Sisto", "Rusko", "Phutureprimitive",
    "Random Rab", "Lizzy Jane", "Savej", "David Starfire", "Dela Moon", "Pauline Herr",
    "Heyz", "The Sponges", "UZ", "The Gaslamp Killer", "Figure", "DMVU", "Toadface",
    "Kumarion", "Bloomurian", "Swampz", "Covex", "Motifv", "MZG", "Mport", "Chance Meridian",
    "Miilk", "Top Brahman", "Naughty Princess", "Shwilly", "Kyral x Banko", "CJ.", "Owie",
    "Shady Jones", "Noetika", "Londen Summers", "Chuck Shadow", "Bass Temple", "CRL CRRLL",
    "Decker Rush", "Paws", "Vinnie"
    ];

    return (
        <section>
            <h1>UPCOMING EVENTS</h1>
                <div className="event-text-container">
                <Link to="https://www.axs.com/uk/events/606664/ship-wrek-tickets" target="_blank" rel="noopener noreferrer">
                    <img src="/assets/PhatJazz-Ogden.jpg" alt="phatjazz" className="flyer-medium"/>
                    <h3>PhatJazz at The Ogden Theatre</h3><br />
                </Link>
                <Link to="https://www.axs.com/uk/events/698484/loud-luxury-tickets" target="_blank" rel="noopener noreferrer">
                    <img src="/assets/Drive Theory-Mission.jpg" alt="driveTheory" className="flyer-medium"/>
                    <h3>Drive Theory at Mission Ballroom</h3><br />
                </Link>
                <Link to="https://www.ticketweb.com/event/ritual-fridays-ft-valentino-khan-the-church-nightclub-tickets/14155733" target="_blank" rel="noopener noreferrer">
                    <img src="/assets/VK-Church.jpg" alt="vk" className="flyer"/>
                    <h3>Valentino Khan at The Church</h3><br />
                </Link>
            <h1>PAST EVENTS</h1>
                <Link to="https://decadencenye.com" target="_blank" rel="noopener noreferrer">
                    <img src="/assets/Decadence.jpg" alt="decadence" className="flyer-medium"/>
                    <h3>Decadence 2024</h3><br /><br />
                </Link>
                <Link to="https://www.secretdreamsfest.com" target="_blank" rel="noopener noreferrer">
                    <img src="/assets/Secret Dreams 24.jpg" alt="secret dreams" className="flyer"/>
                    <h3>Secret Dreams 2024</h3><br /><br />
                </Link>
                <Link to="https://sonicbloomfestival.com" target="_blank" rel="noopener noreferrer">
                    <img src="/assets/Sonic Bloom 23.jpg" alt="sonic bloom" className="flyer"/>
                    <h3>Sonic Bloom 2023</h3><br />
                </Link>
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