import decadence from "../assets/images/Decadence.jpg";
import secretDreams from "../assets/images/Secret Dreams 24.jpg";
import sonicBloom from "../assets/images/Sonic Bloom 23.jpg";
import phatjazz from "../assets/images/PhatJazz-Ogden.jpg";


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
                <img src={phatjazz} alt="phatjazz" className="flyer-large"/>
                <h3>PhatJazz at The Ogden Theatre</h3>
            <h1>PAST EVENTS</h1>
                <img src={decadence} alt="decadence" className="flyer-large"/>
                <h3>Decadence 2024</h3>
                <br /><br /><br />
                <img src={secretDreams} alt="secret dreams" className="flyer"/>
                <h3>Secret Dreams 2024</h3>
                <br /><br /><br />
                <img src={sonicBloom} alt="sonic bloom" className="flyer"/>
                <h3>Sonic Bloom 2023</h3>
                <br />
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