
import { Link } from "react-router-dom";

function Lessons() {
    return (
        <section>
            <h1>LESSONS</h1>
            <div className="icon-container">
                <img src="/assets/Resolume_Arena.png" alt="resolume" className="resolume"/>
                <img src="/assets/synesthesia_logo.png" alt="synesthesia" className="resolume"/>
            </div>
            <div className="lesson-text-container">
            <p>Want to get into VJing, but don’t know where to start?<br />
                Are you already a VJ but want to step up your know-how?<br />
                <br />
                <Link to="/lessonrequest" className="lesson-request-link">
                <strong>Unlock your visual creativity!</strong><br />
                    ➡️ Request a VJ Lesson ⬅️
                </Link>
                <br /><br />
                Transform your live performances with expert VJ lessons designed for all skill levels.<br />
                Learn the art of creating stunning visuals using tools like Resolume and Synesthesia Live.<br /> 
                Whether you&apos;re just starting or looking to refine your craft, Visional’s tailored lessons will help you master the techniques and workflows to captivate any audience.<br />
                <br />
            </p>
            </div>
        </section>
    );
};

export default Lessons;