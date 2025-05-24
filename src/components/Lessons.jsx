
import { Link } from "react-router-dom";

function Lessons() {
    return (
        <section>
            <h1>LESSONS</h1>
            <div className="icon-container">
                <img src="/assets/Arena-Logo.svg" alt="resolume" className="resolume"/>
                <img src="/assets/ShowKontrol.png" alt="showkontrol" className="showkontrol"/>
                <img src="/assets/synesthesia_logo.png" alt="synesthesia" className="synesthesia"/>
            </div>
            <div className="icon-container">
            
            </div>
            <div className="lesson-text-container">
            <p>Want to get into VJing,<br />but don’t know where to start?<br />
                <br />
                Are you already a VJ,<br />but want to step up your know-how?<br />
                <br />
                <Link to="/lessonrequest" className="lesson-request-link">
                <strong>Unlock your visual creativity!</strong><br />
                    ➡️ Click here to request a VJ Lesson ⬅️
                </Link>
                <br /><br />
                Transform your live performances with expert VJ lessons designed for all skill levels.<br /><br />
                Learn the art of creating captivating shows using tools like Resolume, Synesthesia Live, and ShowKontrol.<br /><br />
                Whether you&apos;re just starting or looking to refine your craft, Visional’s tailored lessons will help you master the techniques and workflows to captivate any audience.<br />
                <br />
                <Link to="/lessonrequest" className="lesson-request-link">
                    ➡️ Request a VJ Lesson now ⬅️
                </Link>
            </p>
            </div>
        </section>
    );
};

export default Lessons;