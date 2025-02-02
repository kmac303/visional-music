import { Link } from "react-router-dom";

function Contact() {
    return (
        <section>
            <h1>CONTACT</h1>
            <div className="contact-text-container">
                <p>
                <strong>Email: contact@visionalmusic.com</strong>
                <br />
                <strong>Socials: @visionalmusic</strong>
                </p>
                <p>
                    <strong>Want to book a VJ gig?</strong>
                    <br />
                    <Link to="/vjgigrequestform" className="gig-request-link">
                        Fill out the VJ Gig Request Form
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Contact;