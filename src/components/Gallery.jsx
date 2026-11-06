import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import SectionHeader from "./SectionHeader";

// How many live sets show before "Show all"
const FEATURED_COUNT = 6;

// Video titles and channel names from YouTube, kept for the visit so they load once
const videoInfo = new Map();

function useVideoInfo(videoId) {
    const [info, setInfo] = useState(() => videoInfo.get(videoId) ?? null);

    useEffect(() => {
        if (videoInfo.has(videoId)) return;
        const controller = new AbortController();
        const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`;
        fetch(url, { signal: controller.signal })
            .then((response) => (response.ok ? response.json() : null))
            .then((data) => {
                if (!data) return;
                // The site doesn't use em dashes, so swap any in YouTube's titles for a hyphen
                const details = {
                    title: data.title.replace(/\s*\u2014\s*/g, " - "),
                    channel: data.author_name,
                };
                videoInfo.set(videoId, details);
                setInfo(details);
            })
            .catch(() => {});
        return () => controller.abort();
    }, [videoId]);

    return info;
}

// Shows the video's thumbnail and only loads the real YouTube player when clicked,
// so the page doesn't start dozens of players (and their scripts) at once
function VideoEmbed({ id, title }) {
    const [playing, setPlaying] = useState(false);
    const videoId = id.split("?")[0];
    const info = useVideoInfo(videoId);
    const label = info?.title ?? title;

    if (playing) {
        return (
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={label}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        );
    }

    return (
        <button type="button" className="video-thumb" onClick={() => setPlaying(true)} aria-label={`Play ${label}`}>
            <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" loading="lazy" />
            {info && (
                <span className="video-thumb-info" aria-hidden="true">
                    <span className="video-thumb-title">{info.title}</span>
                    <span className="video-thumb-channel">{info.channel}</span>
                </span>
            )}
            <span className="video-thumb-play" aria-hidden="true"><FaPlay /></span>
        </button>
    );
}

function Gallery() {
    const liveSets = [
        "-LXMkHBRMYU",
        "HoThrF1lgVA",
        "koF3Oj2KLPE",
        "8WJu0ZSTP-0?si",
        "LiPEmsggcZs?si",
        "-ed4y-uYdAU",
        "bDPzBRwPQHM",
        "oRSKuSKv_oc",
        "ZtlzUolyLk0",
        "JkARTwNcIBI?",
        "el1WqlZqmkc",
        "oB0On43-wU8",
        "w2wxdkdhYTU",
        "2TBDQxYke6c",
        "8grws28uJjQ",
        "zxcvxfd-Pc0",
        "sX9OlZJ-myQ",
        "oFMawbkvfHU",
        "TLnfv-eQb24",
        "ge67BqNKB7M",
        // "5tvJvxBy1ms",
    ];

    const projects = [
        "51PZq4GQQrw",
        "Y0QWp5UW7z4"
    ];
    const [showAll, setShowAll] = useState(false);
    const shownSets = showAll ? liveSets : liveSets.slice(0, FEATURED_COUNT);

    return (
        <section id="gallery" className="page-section gallery-section">
            <SectionHeader index="03" label="Gallery" title="Live VJ sets" />
            <div className="video-gallery">
                {shownSets.map((id, index) => (
                    <div className="video-container" key={id}>
                        <VideoEmbed id={id} title={`Live set ${index + 1}`} />
                    </div>
                ))}
            </div>
            {liveSets.length > FEATURED_COUNT && (
                <button type="button" className="hud-button gallery-toggle" onClick={() => setShowAll(!showAll)} aria-expanded={showAll}>
                    {showAll ? "Show fewer −" : `Show all ${liveSets.length} sets +`}
                </button>
            )}

            <SectionHeader index="03.1" label="Collaborations" title="Art collaborations" />
            <div className="video-gallery">
                {projects.map((id, index) => (
                    <div className="video-container" key={id}>
                        <VideoEmbed id={id} title={`Art collaboration ${index + 1}`} />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Gallery;
