import { Link } from 'react-router-dom';
import logo from "../assets/images/Logo.png";
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

function NavBar() {
    return (
        <nav className="navbar">
            <ul className="link-container">
                <li><Link to="/">About</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
                <li><Link to="/lessons">Lessons</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
            <header>
            <div className="logo-container">
                <img src={logo} alt="Visional Music Logo" className="logo" />
            </div>
            </header>
            <div className="social-media-container">
                <a href="https://www.instagram.com/visionalmusic" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="social-icon" />
                </a>
                <a href="https://www.youtube.com/@visionalmusic" target="_blank" rel="noopener noreferrer">
                    <FaYoutube className="social-icon" />
                </a>
                <a href="https://www.tiktok.com/@visionalmusic" target="_blank" rel="noopener noreferrer">
                    <FaTiktok className="social-icon" />
                </a>
            </div>
        </nav>
    );
};

export default NavBar;