// A readout-style label over a big section title, e.g. "[02] // EVENTS"
function SectionHeader({ index, label, title }) {
    return (
        <header className="section-header">
            <div className="hud-label">[{index}] // {label}</div>
            <h2 className="section-title">{title}</h2>
        </header>
    );
}

export default SectionHeader;
