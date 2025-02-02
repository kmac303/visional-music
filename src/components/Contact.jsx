import VJGigRequestForm from "./VJGigRequestForm";

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
            </div>
            <VJGigRequestForm />
        </section>
    );
};

export default Contact;