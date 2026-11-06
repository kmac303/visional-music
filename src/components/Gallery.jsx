import { useState } from "react";
import { FaPlay } from "react-icons/fa";

// Shows the video's thumbnail and only loads the real YouTube player when clicked,
// so the page doesn't start dozens of players (and their scripts) at once
function VideoEmbed({ id, title }) {
    const [playing, setPlaying] = useState(false);
    const videoId = id.split("?")[0];

    if (playing) {
        return (
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        );
    }

    return (
        <button type="button" className="video-thumb" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
            <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className="video-thumb-play" aria-hidden="true"><FaPlay /></span>
        </button>
    );
}

function Gallery() {
    const liveSets = [
        "-LXMkHBRMYU",
        "29xlEq0ZG-g",
        "NXbvClcYD2o",
        "HoThrF1lgVA",
        "koF3Oj2KLPE",
        "8WJu0ZSTP-0?si",
        "LiPEmsggcZs?si",
        "-ed4y-uYdAU",
        "bDPzBRwPQHM",
        "oRSKuSKv_oc",
        "ZtlzUolyLk0",
        "ZPwsvjX0EWc",
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
    return (
        <section>
            {/* <h1>GALLERY</h1> */}
            <h1>Visional's Live VJ Sets</h1>
            {/* <h3>Concerts Featuring Visional's Visuals</h3> */}
            <div className="video-gallery">
                {liveSets.map((id, index) => (
                    <div className="video-container" key={index}>
                        <VideoEmbed id={id} title={`YouTube video ${index + 1}`} />
                    </div>
                ))}
            </div>
            <h1>Art Collaborations</h1>
            {/* <h3>Artist Collaborations</h3> */}
            <div className="video-gallery">
                {projects.map((id, index) => (
                    <div className="video-container" key={index}>
                        <VideoEmbed id={id} title={`YouTube video ${index + 1}`} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Gallery;
