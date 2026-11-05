import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

// Set to null to hide the play button.
const TRACK = { src: "/audio/solstice-visional-remix.mp3", title: "Savej – Solstice (Visional Remix)" };

const vertexShader = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

const fragmentShader = `
    precision mediump float;

    uniform vec2 u_res;
    uniform float u_time;
    uniform float u_bass;
    uniform float u_mid;
    uniform float u_high;
    uniform float u_kick;
    uniform float u_dim;

    float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
    }

    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p = p * 2.03 + vec2(1.7, 9.2);
            a *= 0.5;
        }
        return v;
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
        float t = u_time * 0.06;

        // Glitch slices: horizontal bands jump sideways on kicks and hi-hats
        float band = floor(uv.y * 28.0);
        float tick = floor(u_time * 14.0);
        float glitch = step(1.0 - 0.15 * u_high - 0.55 * u_kick, hash(vec2(band, tick)));
        p.x += glitch * (hash(vec2(band, tick + 7.0)) - 0.5) * 0.25 * (0.3 + u_kick + u_high);

        // Domain-warped noise for the flowing base
        vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 4.0));
        vec2 r = vec2(fbm(p * 2.0 + 3.0 * q + vec2(1.7, 9.2) + 0.4 * u_mid),
                      fbm(p * 2.0 + 3.0 * q + vec2(8.3, 2.8) - 0.2 * u_bass));
        float f = fbm(p * 1.8 + 3.0 * r);

        // Iris rings pulse outward from the center with the bass
        float d = length(p);
        float rings = pow(sin(d * 16.0 - u_time * 1.2 - u_bass * 5.0) * 0.5 + 0.5, 10.0);
        rings *= smoothstep(1.3, 0.05, d) * (0.08 + 1.1 * u_bass);

        vec3 deep = vec3(0.02, 0.01, 0.05);
        vec3 violet = vec3(0.14, 0.05, 0.28);
        vec3 cyan = vec3(0.33, 0.85, 0.95);
        vec3 red = vec3(0.92, 0.12, 0.25);

        vec3 col = mix(deep, violet, smoothstep(0.25, 0.85, f));
        col += cyan * pow(r.x, 3.0) * (0.3 + 1.3 * u_mid);
        col += red * pow(q.y, 4.0) * (0.25 + 1.6 * u_bass);
        col += mix(cyan, red, 0.5 + 0.5 * sin(u_time * 0.3)) * rings;

        // Color split on glitched bands
        col.r += glitch * 0.25 * (u_kick + 0.2);
        col.b += glitch * 0.2 * (u_high + 0.2);

        col *= 0.88 + 0.12 * sin(gl_FragCoord.y * 3.14159);
        col += (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) * 0.05;
        col *= smoothstep(1.5, 0.25, d);
        col += cyan * u_kick * 0.05;

        gl_FragColor = vec4(col * u_dim, 1.0);
    }
`;

function compile(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Turns raw FFT data into smoothed bass/mid/high levels plus a kick pulse.
function createAnalysis() {
    const level = { bass: 0, mid: 0, high: 0, kick: 0 };
    const peak = { bass: 0.2, mid: 0.2, high: 0.2 };
    let bassAverage = 0;
    let lastKick = 0;

    function bandAverage(data, binHz, lo, hi) {
        const start = Math.max(1, Math.floor(lo / binHz));
        const end = Math.min(data.length - 1, Math.ceil(hi / binHz));
        let sum = 0;
        for (let i = start; i <= end; i++) sum += data[i];
        return sum / ((end - start + 1) * 255);
    }

    function smooth(name, value) {
        // Auto-gain: quiet mics and loud tracks both fill the 0-1 range
        peak[name] = Math.max(value, peak[name] * 0.995, 0.08);
        const normalized = Math.min(1, value / peak[name]);
        const rate = normalized > level[name] ? 0.5 : 0.1;
        level[name] += (normalized - level[name]) * rate;
    }

    return {
        level,
        update(data, binHz, now) {
            const bass = bandAverage(data, binHz, 30, 150);
            smooth("bass", bass);
            smooth("mid", bandAverage(data, binHz, 250, 2000));
            smooth("high", bandAverage(data, binHz, 4000, 12000));

            bassAverage += (bass - bassAverage) * 0.05;
            if (bass - bassAverage > 0.08 && now - lastKick > 180) {
                level.kick = 1;
                lastKick = now;
            }
            level.kick *= 0.9;
        },
        decay() {
            level.bass *= 0.95;
            level.mid *= 0.95;
            level.high *= 0.95;
            level.kick *= 0.9;
        },
    };
}

function AudioBackground() {
    const canvasRef = useRef(null);
    const audioRef = useRef({ context: null, analyser: null, element: null, stream: null, source: null });
    const [mode, setMode] = useState("off");
    const [message, setMessage] = useState("");
    const [reducedMotion] = useState(() =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    // With reduced motion, keep the still image until the visitor turns on sound themselves
    const animate = !reducedMotion || mode !== "off";

    useEffect(() => {
        if (!animate) return;
        const canvas = canvasRef.current;
        const gl = canvas.getContext("webgl", { antialias: false, powerPreference: "low-power" });
        if (!gl) return;

        const program = gl.createProgram();
        const vs = compile(gl, gl.VERTEX_SHADER, vertexShader);
        const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
        if (!vs || !fs) return;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const position = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

        const uniforms = {};
        ["u_res", "u_time", "u_bass", "u_mid", "u_high", "u_kick", "u_dim"].forEach((name) => {
            uniforms[name] = gl.getUniformLocation(program, name);
        });
        gl.uniform1f(uniforms.u_dim, 0.75);

        // Render below screen resolution: it's a soft background, and this keeps phones cool
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        const scale = isMobile ? 0.35 : 0.5;
        function resize() {
            canvas.width = Math.max(1, Math.round(window.innerWidth * scale));
            canvas.height = Math.max(1, Math.round(window.innerHeight * scale));
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uniforms.u_res, canvas.width, canvas.height);
        }
        resize();
        window.addEventListener("resize", resize);

        const analysis = createAnalysis();
        let data = null;
        let frame;
        let lastDraw = 0;
        const frameInterval = isMobile ? 1000 / 30 : 0;
        const start = performance.now();

        function draw(now) {
            frame = requestAnimationFrame(draw);
            if (now - lastDraw < frameInterval) return;
            lastDraw = now;

            const { analyser } = audioRef.current;
            if (analyser) {
                if (!data || data.length !== analyser.frequencyBinCount) {
                    data = new Uint8Array(analyser.frequencyBinCount);
                }
                analyser.getByteFrequencyData(data);
                analysis.update(data, analyser.context.sampleRate / analyser.fftSize, now);
            } else {
                analysis.decay();
            }

            const { level } = analysis;
            gl.uniform1f(uniforms.u_time, (now - start) / 1000);
            gl.uniform1f(uniforms.u_bass, level.bass);
            gl.uniform1f(uniforms.u_mid, level.mid);
            gl.uniform1f(uniforms.u_high, level.high);
            gl.uniform1f(uniforms.u_kick, level.kick);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
        frame = requestAnimationFrame(draw);
        canvas.classList.add("ready");

        function handleContextLost(event) {
            event.preventDefault();
            cancelAnimationFrame(frame);
            canvas.classList.remove("ready");
        }
        canvas.addEventListener("webglcontextlost", handleContextLost);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("webglcontextlost", handleContextLost);
            canvas.classList.remove("ready");
            gl.deleteBuffer(buffer);
            gl.deleteProgram(program);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
        };
    }, [animate]);

    // Release the mic and audio context when the component goes away
    useEffect(() => {
        const audio = audioRef.current;
        return () => {
            audio.stream?.getTracks().forEach((track) => track.stop());
            audio.element?.pause();
            audio.context?.close();
        };
    }, []);

    function getContext() {
        const audio = audioRef.current;
        if (!audio.context) {
            audio.context = new AudioContext();
            audio.analyser = audio.context.createAnalyser();
            audio.analyser.fftSize = 1024;
            audio.analyser.smoothingTimeConstant = 0.75;
        }
        // Browsers only allow audio to start from a click, so resume here
        audio.context.resume();
        return audio;
    }

    function stopMic() {
        const audio = audioRef.current;
        audio.stream?.getTracks().forEach((track) => track.stop());
        audio.source?.disconnect();
        audio.stream = null;
        audio.source = null;
    }

    async function toggleMic() {
        if (mode === "mic") {
            stopMic();
            setMode("off");
            return;
        }
        setMessage("");
        audioRef.current.element?.pause();
        const audio = getContext();
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
            });
            stopMic();
            audio.stream = stream;
            // Analyse only: the mic is never connected to the speakers, so there's no feedback
            audio.source = audio.context.createMediaStreamSource(stream);
            audio.source.connect(audio.analyser);
            setMode("mic");
        } catch {
            setMessage("Microphone access was blocked.");
            setMode("off");
        }
    }

    function toggleTrack() {
        if (mode === "track") {
            audioRef.current.element.pause();
            setMode("off");
            return;
        }
        setMessage("");
        stopMic();
        const audio = getContext();
        if (!audio.element) {
            audio.element = new Audio(TRACK.src);
            audio.element.addEventListener("ended", () => setMode("off"));
            const source = audio.context.createMediaElementSource(audio.element);
            source.connect(audio.analyser);
            source.connect(audio.context.destination);
        }
        audio.element.play().then(
            () => setMode("track"),
            () => setMessage("The track couldn't be played.")
        );
    }

    return (
        <>
            <canvas ref={canvasRef} className="audio-background" aria-hidden="true" />
            <div className="audio-controls">
                {message && <span className="audio-message">{message}</span>}
                {mode === "mic" && <span className="audio-message">Your audio stays on your device.</span>}
                {TRACK && (
                    <button
                        type="button"
                        onClick={toggleTrack}
                        aria-pressed={mode === "track"}
                        title={TRACK.title}
                        aria-label={mode === "track" ? "Pause track" : `Play ${TRACK.title}`}
                    >
                        {mode === "track" ? <FaPause /> : <FaPlay />}
                        <span>{mode === "track" ? "Pause" : TRACK.title}</span>
                    </button>
                )}
                <button
                    type="button"
                    onClick={toggleMic}
                    aria-pressed={mode === "mic"}
                    title="Make the background react to sound around you"
                    aria-label={mode === "mic" ? "Stop microphone" : "Make the background react to your microphone"}
                >
                    {mode === "mic" ? <FaMicrophoneSlash /> : <FaMicrophone />}
                    <span>{mode === "mic" ? "Stop mic" : "React to mic"}</span>
                </button>
            </div>
        </>
    );
}

export default AudioBackground;
