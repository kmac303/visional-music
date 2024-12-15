import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from "../assets/images/Visional Icon.png";
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

function NavBar() {
    const [isScrollingUp, setIsScrollingUp] = useState(true);
    let lastScrollY = 0;

    // Scroll handling logic
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY) {
            setIsScrollingUp(false); // User is scrolling down
        } else {
            setIsScrollingUp(true); // User is scrolling up
        }
        lastScrollY = currentScrollY;
    };

    // Attach the scroll listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // JSX for the Navbar
    return (
        <nav className={`navbar ${isScrollingUp ? 'show' : 'hide'}`}>
                <ul className="link-container">
                    {/* <li><Link to="/about">About</Link></li> */}
                    <li><Link to="/events">Events</Link></li>
                    <li><Link to="/gallery">Gallery</Link></li>
                    <li><Link to="/lessons">Lessons</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            <header>
                <div className="logo-container">
                    <Link to="/">
                        <img src={logo} alt="Visional Music Logo" className="logo" />
                    </Link>
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
                    {/* <a href="https://www.tiktok.com/@visionalmusic" target="_blank" rel="noopener noreferrer">
                        <FaTiktok className="social-icon" />
                    </a> */}
                </div>
        </nav>
    );
}

export default NavBar;