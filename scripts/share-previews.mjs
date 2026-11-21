// Gives some shareable links their own link preview (the title and description shown when
// the link is pasted into a text, DM or post).
//
// The site is one page, so every link normally gets the preview tags from index.html. After
// the build, this writes a copy of the page for each link below with its own title and
// description, e.g. dist/testimonials.html, which Netlify serves at /testimonials. The page
// itself works exactly the same; only the preview changes.
//
// To give another link its own preview, add it here (and to the routes in App.jsx).
import { readFileSync, writeFileSync } from "node:fs";

const SITE = "https://visionalmusic.com";

const PREVIEWS = [
    {
        path: "testimonials",
        title: "What artists say about Visional",
        description: "Quotes from artists like Heyz, DJ Pressed and Savej on working with Visional, an audio-reactive VJ in Denver, CO.",
    },
    {
        path: "shows",
        title: "Visional | Show log",
        description: "Upcoming and past shows with live visuals by Visional, an audio-reactive VJ in Denver, CO.",
    },
];

const page = readFileSync("dist/index.html", "utf8");

const escape = (text) => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Swaps one tag's value, and stops the build if the tag isn't there (so a change to
// index.html can't quietly break the previews)
function replaceTag(html, pattern, replacement, name) {
    if (!pattern.test(html)) throw new Error(`share-previews: couldn't find ${name} in dist/index.html`);
    return html.replace(pattern, replacement);
}

for (const preview of PREVIEWS) {
    const title = escape(preview.title);
    const description = escape(preview.description);
    let html = page;
    html = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`, "<title>");
    html = replaceTag(html, /(<meta name="description" content=")[^"]*(")/, `$1${description}$2`, "description");
    html = replaceTag(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`, "og:title");
    html = replaceTag(html, /(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`, "og:description");
    html = replaceTag(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${SITE}/${preview.path}$2`, "og:url");
    writeFileSync(`dist/${preview.path}.html`, html);
    console.log(`share-previews: dist/${preview.path}.html`);
}
