// import headshot from "/public/assets/Visional Headshot.jpg";

function About() {
    return (
        <section>
            {/* <div className="visional-text-container">
                <img src={visional} alt="visional" className="visional-text" />
            </div> */}
            <div className="image-text-container">
                <img src="/assets/Visional Headshot.jpg" alt="Headshot" className="headshot" />
                <p>Specializing in concert visuals, Visional has developed his own unique style of live visuals within a few short years. 
                    As a self-taught VJ, he began honing his skills during the pandemic,  providing live visuals weekly on a Twitch DJ livestream channel. 
                    This helped him learn not only how to VJ for a wide range of music genres, but also how to implement unique camera fx.
                    <br /><br />
                    Once in-person concerts finally returned, he’s worked with artists all over the U.S. including at Red Rocks, Legend Valley, and even Burning Man. 
                    As a Producer/DJ himself, he strives to visually express every musician he works with, immersing the crowd into an audio-visual experience with each 
                    and every set.
                 </p>
            </div>
        </section>
    );
};

export default About;