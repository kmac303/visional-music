import { useState } from "react";

// The booking address, stored with every character shifted by 3 so it never appears
// as plain text in the page or the site's code, where spam bots harvest addresses.
// It's only pieced together when a visitor clicks. To change the address, shift each
// character of the new one up by 3 (for example "a" becomes "d", "@" becomes "C").
const ENCODED = "frqwdfwCylvlrqdopxvlf1frp";

function emailAddress() {
    return Array.from(ENCODED, (character) => String.fromCharCode(character.charCodeAt(0) - 3)).join("");
}

// A button that reveals the booking email and opens the visitor's mail app.
// The address stays on screen afterwards, with a Copy button, for anyone whose
// browser doesn't open a mail app.
function EmailLink({ className, label = "Email Visional" }) {
    const [address, setAddress] = useState(null);
    const [copied, setCopied] = useState(false);

    function reveal() {
        const email = emailAddress();
        setAddress(email);
        window.location.href = `mailto:${email}`;
    }

    async function copy() {
        try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard blocked: the address is on screen to copy by hand
        }
    }

    if (!address) {
        return (
            <button type="button" className={`email-reveal ${className || ""}`} onClick={reveal}>
                {label}
            </button>
        );
    }

    return (
        <span className="email-revealed">
            <a className={className} href={`mailto:${address}`}>
                {address}
            </a>
            <button type="button" className="email-copy" onClick={copy}>
                {copied ? "Copied" : "Copy"}
            </button>
        </span>
    );
}

export default EmailLink;
