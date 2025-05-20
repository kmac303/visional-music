
function Gallery() {
    const liveSets = [
        "w2wxdkdhYTU",
        "2TBDQxYke6c",
        "8grws28uJjQ",
        "zxcvxfd-Pc0",
        "sX9OlZJ-myQ",
        "oFMawbkvfHU",
        "TLnfv-eQb24",
        "ge67BqNKB7M",
        "5tvJvxBy1ms",
        "/_n2plYZiDWM"
    ];

    const projects = [
        "51PZq4GQQrw",
        "Y0QWp5UW7z4"
    ];
    return (
        <section>
            <h1>GALLERY</h1>
            <h2>Live Sets</h2>
            <h4>Recordings of sets Visional has performed live visuals for:</h4>
            <div className="video-gallery">
                {liveSets.map((id, index) => (
                    <div className="video-container" key={index}>
                        <iframe
                            src={`https://www.youtube.com/embed/${id}`}
                            title={`YouTube video ${index + 1}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ))}
            </div>
            <h2>Projects</h2>
            <h4>Visual projects Visional has collaborated with musicians on:</h4>
            <div className="video-gallery">
                {projects.map((id, index) => (
                    <div className="video-container" key={index}>
                        <iframe
                            src={`https://www.youtube.com/embed/${id}`}
                            title={`YouTube video ${index + 1}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Gallery;
