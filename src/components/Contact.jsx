import { Link } from "react-router-dom";

function Contact() {
    return (
        <section>
            <h1>CONTACT</h1>
            <div className="contact-text-container">
                <p>
                    <strong>Want to book a VJ set?
                    <br />
                    <Link to="/vjrequest" className="gig-request-link">
                    ➡ Fill out the VJ Request Form ⬅
                    </Link>
                    </strong>
                </p>
                <br /><br />
                <p>
                    <strong>
                    All Socials:
                    <br />
                    @visionalmusic
                    </strong>
                </p>
            </div>
        </section>
    );
};

export default Contact;