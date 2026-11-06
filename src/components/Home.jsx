import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Hero from "./Hero";
import About from "./About";
import Events from "./Events";
import Gallery from "./Gallery";
import Contact from "./Contact";

// The whole site on one scrolling page. /about, /events, /gallery, and /contact
// still work as links: they open this page and scroll to that section.
function Home() {
    const location = useLocation();
    const firstVisit = useRef(true);

    useEffect(() => {
        const id = location.pathname.replace(/^\/+|\/+$/g, "");
        const isFirstVisit = firstVisit.current;
        firstVisit.current = false;
        // Jump instead of gliding on a direct link, or for visitors who turned on reduced motion
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const behavior = isFirstVisit || reducedMotion ? "auto" : "smooth";

        if (!id) {
            if (!isFirstVisit) window.scrollTo({ top: 0, behavior });
            return;
        }
        const scrollToSection = () => document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
        scrollToSection();
        if (!isFirstVisit) return;

        // On a direct link, the browser may restore an old scroll position and images can
        // still shift the layout, so line up again once the page has finished loading
        window.history.scrollRestoration = "manual";
        if (document.readyState === "complete") return;
        window.addEventListener("load", scrollToSection, { once: true });
        return () => window.removeEventListener("load", scrollToSection);
    }, [location.key, location.pathname]);

    return (
        <main className="page">
            <Hero />
            <About />
            <Events />
            <Gallery />
            <Contact />
        </main>
    );
}

export default Home;
