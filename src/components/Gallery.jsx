
function Gallery() {
    const liveSets = [
        "oFMawbkvfHU",
        "TLnfv-eQb24",
        "ge67BqNKB7M",
        "kFf-zXOdVsU",
        "_lVxrLXI6AI",
        "L1F0B5SgCd4"
    ];

    const projects = [
        "51PZq4GQQrw",
        "Y0QWp5UW7z4"
    ];
    return (
        <section>
            <h1>GALLERY</h1>
            <h2>Live Sets</h2>
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