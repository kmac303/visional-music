import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import SectionHeader from "./SectionHeader";
import EmailLink from "./EmailLink";

function Contact() {
    return (
        <section id="contact" className="page-section contact-section">
            <SectionHeader index="04" label="open_channel" title="Book a set" />
            <p className="contact-lead">Want Visional on the screens at your show? Need custom content? Get in touch.</p>
            <EmailLink className="contact-email" />
            <ul className="contact-socials">
                <li>
                    <a href="https://www.instagram.com/visionalmusic" target="_blank" rel="noopener noreferrer">
                        <FaInstagram aria-hidden="true" /> @visionalmusic
                    </a>
                </li>
                <li>
                    <a href="https://www.youtube.com/@visionalmusic" target="_blank" rel="noopener noreferrer">
                        <FaYoutube aria-hidden="true" /> YouTube
                    </a>
                </li>
                <li>
                    <a href="https://www.tiktok.com/@visionalmusic" target="_blank" rel="noopener noreferrer">
                        <FaTiktok aria-hidden="true" /> TikTok
                    </a>
                </li>
            </ul>
            <div className="hud-label contact-signoff">End of transmission // Visional {new Date().getFullYear()}</div>
        </section>
    );
}

export default Contact;
