// A readout-style label over a big section title, e.g. "[02] // events.db". The label reads
// like a file or process name, so it keeps its lowercase instead of the HUD's usual caps.
function SectionHeader({ index, label, title }) {
    return (
        <header className="section-header">
            <div className="hud-label section-label">
                [{index}] // {label}
                <span className="terminal-cursor" aria-hidden="true" />
            </div>
            <h2 className="section-title">{title}</h2>
        </header>
    );
}

export default SectionHeader;
