import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import GlitchLogo from './GlitchLogo';

const SOCIALS = [
    { label: "IG", name: "Instagram", href: "https://www.instagram.com/visionalmusic" },
    { label: "YT", name: "YouTube", href: "https://www.youtube.com/@visionalmusic" },
    { label: "TT", name: "TikTok", href: "https://www.tiktok.com/@visionalmusic" },
];

const SECTIONS = [
    { label: "About", to: "/about" },
    { label: "Events", to: "/events" },
    { label: "Gallery", to: "/gallery" },
    { label: "Contact", to: "/contact" },
];

// No bar: the logo sits in the top-left corner and the socials (or the Menu button
// on phones) in the top-right, floating over the page. Section links live in the
// bottom bar; on phones they open from the Menu button.
function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!menuOpen) return;
        const handleKey = (event) => {
            if (event.key === 'Escape') setMenuOpen(false);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="top-bar">
            <Link to="/" className="top-bar-logo" aria-label="Visional home" onClick={closeMenu}>
                <GlitchLogo src="/assets/VISIONAL Logo.png" alt="Visional Music Logo" className="logo-icon" />
            </Link>

            <nav className="top-bar-socials" aria-label="Social media">
                {SOCIALS.map((social) => (
                    <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                        {social.label} <span aria-hidden="true">↗</span>
                    </a>
                ))}
            </nav>

            <button
                type="button"
                className="top-bar-menu"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-controls="site-menu"
            >
                {menuOpen ? 'Close ×' : 'Menu +'}
            </button>

            {menuOpen && (
                <nav id="site-menu" className="site-menu" aria-label="Sections">
                    <ul>
                        {SECTIONS.map((section, index) => (
                            <li key={section.to}>
                                <Link to={section.to} onClick={closeMenu}>
                                    <span className="hud-label">{String(index + 1).padStart(2, '0')}</span>
                                    {section.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="site-menu-socials">
                        {SOCIALS.map((social) => (
                            <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
                                {social.name} ↗
                            </a>
                        ))}
                    </div>
                </nav>
            )}
        </header>
    );
}

export default NavBar;
