import resolume from "/public/assets/Resolume_Arena.png";
import synesthesia from "/public/assets/synesthesia_logo.png";

function Lessons() {
    return (
        <section>
            <h1>LESSONS</h1>
            <div className="icon-container">
                <img src={resolume} alt="resolume" className="resolume"/>
                <img src={synesthesia} alt="synesthesia" className="resolume"/>
            </div>
            <div className="lesson-text-container">
            <p>Want to get into VJing, but don’t know where to start?<br />
                Are you already a VJ but want to step up your know-how?<br />
                <br />
                <strong>Unlock your visual creativity!</strong><br />
                <br />
                Transform your live performances with expert VJ lessons designed for all skill levels.<br />
                Learn the art of creating stunning visuals using tools like Resolume and Synesthesia Live.<br /> 
                Whether you&apos;re just starting or looking to refine your craft, Visional’s tailored lessons will help you master the techniques and workflows to captivate any audience.<br />
                <br />
                <strong>Email contact@visionalmusic.com to book your session today and bring your visuals to life!</strong>
            </p>
            </div>
        </section>
    );
};

export default Lessons;