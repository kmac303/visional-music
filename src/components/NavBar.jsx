// import { Link } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import logo from "../assets/images/Visional Icon.png";
// import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

// function NavBar() {
//     const [isScrollingUp, setIsScrollingUp] = useState(true);
//     const [isMenuOpen, setIsMenuOpen] = useState(false); // Track menu visibility
//     let lastScrollY = 0;

//     // Scroll handling logic
//     const handleScroll = () => {
//         const currentScrollY = window.scrollY;
//         if (currentScrollY > lastScrollY) {
//             setIsScrollingUp(false);
//         } else {
//             setIsScrollingUp(true);
//         }
//         lastScrollY = currentScrollY;
//     };

//     useEffect(() => {
//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     return (
//         <nav className={`navbar ${isScrollingUp ? 'show' : 'hide'}`}>
//             <div className="logo-container">
//                 <Link to="/">
//                     <img src={logo} alt="Visional Music Logo" className="logo" />
//                 </Link>
//             </div>

//             {/* Toggle Button */}
//             <button 
//                 className="menu-toggle" 
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//                 ☰
//             </button>

//             {/* Conditional Rendering for Mobile */}
//             <ul className={`link-container ${isMenuOpen ? 'open' : ''}`}>
//                 <li><Link to="/events">Events</Link></li>
//                 <li><Link to="/gallery">Gallery</Link></li>
//                 <li><Link to="/lessons">Lessons</Link></li>
//                 <li><Link to="/contact">Contact</Link></li>
//             </ul>

//             <div className="social-media-container">
//                 <a href="https://www.instagram.com/visionalmusic" target="_blank" rel="noopener noreferrer">
//                     <FaInstagram className="social-icon" />
//                 </a>
//                 <a href="https://www.youtube.com/@visionalmusic" target="_blank" rel="noopener noreferrer">
//                     <FaYoutube className="social-icon" />
//                 </a>
//                 <a href="https://www.tiktok.com/@visionalmusic" target="_blank" rel="noopener noreferrer">
//                     <FaTiktok className="social-icon" />
//                 </a>
//             </div>
//         </nav>
//     );
// }

// export default NavBar;

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from "../assets/images/Visional Icon.png";
import visional from "../assets/images/Visional Text.png";
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

function NavBar() {
    const [isScrollingUp, setIsScrollingUp] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
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

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Attach the scroll listener with passive option
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`navbar ${isScrollingUp ? 'show' : 'hide'}`}>
            {/* Mobile Menu Toggle */}
            <button className="menu-toggle" onClick={toggleMenu}>
                ☰
            </button>

            {/* Mobile Dropdown Menu */}
            <ul className={`link-container ${menuOpen ? "open" : ""}`}>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
                <li><Link to="/lessons">Lessons</Link></li>
                <li><Link to="/contact">Contact</Link></li>

                {/* Mobile Social Media Icons */}
                <div className="social-media-container social-media-mobile">
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
            </ul>

            {/* Logo */}
            <header>
                <div className="logo-container">
                    <Link to="/">
                        <div className="logo-wrapper">
                        <img src={logo} alt="Visional Music Logo" className="logo-icon" />
                        <img src={visional} alt="visional" className="logo-text" />
                        </div>
                    </Link>
                </div>
            </header>

            {/* Desktop Social Media Icons */}
            <div className="social-media-container social-media-desktop">
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
}

export default NavBar;

// import { Link } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import logo from "../assets/images/Visional Icon.png";
// import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

// function NavBar() {
//     const [isScrollingUp, setIsScrollingUp] = useState(true);
//     let lastScrollY = 0;

//     // Scroll handling logic
//     const handleScroll = () => {
//         const currentScrollY = window.scrollY;
//         if (currentScrollY > lastScrollY) {
//             setIsScrollingUp(false); // User is scrolling down
//         } else {
//             setIsScrollingUp(true); // User is scrolling up
//         }
//         lastScrollY = currentScrollY;
//     };

//     // Attach the scroll listener
//     useEffect(() => {
//         window.addEventListener('scroll', handleScroll);
//         return () => {
//             window.removeEventListener('scroll', handleScroll);
//         };
//     }, []);

//     // JSX for the Navbar
//     return (
//         <nav className={`navbar ${isScrollingUp ? 'show' : 'hide'}`}>
//                 <ul className="link-container">
//                     {/* <li><Link to="/about">About</Link></li> */}
//                     <li><Link to="/events">Events</Link></li>
//                     <li><Link to="/gallery">Gallery</Link></li>
//                     <li><Link to="/lessons">Lessons</Link></li>
//                     <li><Link to="/contact">Contact</Link></li>
//                 </ul>
//             <header>
//                 <div className="logo-container">
//                     <Link to="/">
//                         <img src={logo} alt="Visional Music Logo" className="logo" />
//                     </Link>
//                 </div>
//             </header>
//                 <div className="social-media-container">
//                     <a href="https://www.instagram.com/visionalmusic" target="_blank" rel="noopener noreferrer">
//                         <FaInstagram className="social-icon" />
//                     </a>
//                     <a href="https://www.youtube.com/@visionalmusic" target="_blank" rel="noopener noreferrer">
//                         <FaYoutube className="social-icon" />
//                     </a>
//                     <a href="https://www.tiktok.com/@visionalmusic" target="_blank" rel="noopener noreferrer">
//                         <FaTiktok className="social-icon" />
//                     </a>
//                     {/* <a href="https://www.tiktok.com/@visionalmusic" target="_blank" rel="noopener noreferrer">
//                         <FaTiktok className="social-icon" />
//                     </a> */}
//                 </div>
//         </nav>
//     );
// }

// export default NavBar;