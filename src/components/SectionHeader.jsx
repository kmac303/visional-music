// A readout-style label over a big section title, e.g. "[02] // events.db". The label reads
// like a file or process name, so it keeps its lowercase instead of the HUD's usual caps.
// Pass an id to make the header a link target, like /testimonials.
function SectionHeader({ index, label, title, id }) {
    return (
        <header className="section-header" id={id}>
            <div className="hud-label section-label">
                [{index}] // {label}
                <span className="terminal-cursor" aria-hidden="true" />
            </div>
            <h2 className="section-title">{title}</h2>
        </header>
    );
}

export default SectionHeader;
