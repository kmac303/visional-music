import resolume from "../assets/images/Resolume_Arena.png";
import synesthesia from "../assets/images/synesthesia_logo.png";

function Lessons() {
    return (
        <section>
            <h1>LESSONS</h1>
            <div className="lesson-text-container">
            <p>Want to get into VJing, but don’t know where to start? Are you already a VJ but want to step up your know-how?
                <br /><br />
                <strong>Unlock your visual creativity!</strong>
                <br /><br />
                Transform your live performances with expert VJ lessons designed for all skill levels. 
                Learn the art of creating stunning visuals using tools like Resolume and Synesthesia Live. 
                Whether youre just starting or looking to refine your craft, Visional’s tailored lessons will help you master the techniques and workflows to captivate any audience. 
                <br /><br />
                <strong>Email contact@visionalmusic.com to book your session today and bring your visuals to life!</strong>
            </p>
            </div>
            <div className="icon-container">
                <img src={resolume} alt="resolume" className="resolume"/>
                <img src={synesthesia} alt="synesthesia" className="resolume"/>
            </div>
        </section>
    );
};

export default Lessons;