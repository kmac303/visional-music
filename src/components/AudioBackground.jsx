import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

// Set to null to hide the play button.
const TRACK = { src: "/audio/solstice-visional-remix.mp3", title: "Savej – Solstice (Visional Remix)" };

const GLITCH_IMAGE = "/Glitch_BG.jpg";

const vertexShader = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

const fragmentShader = `
    precision mediump float;

    uniform sampler2D u_texture;
    uniform vec2 u_res;
    uniform float u_time;
    uniform float u_flow;
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

    // Mirror-repeat so the glitch image tiles without visible seams
    vec3 glitch(vec2 uv) {
        return texture2D(u_texture, 1.0 - abs(mod(uv, 2.0) - 1.0)).rgb;
    }

    void main() {
        vec2 screen = gl_FragCoord.xy / u_res;
        // Cover-fit the square image to the screen, with a small punch-in on kicks
        vec2 uv = (screen - 0.5) * (u_res / max(u_res.x, u_res.y)) * (0.9 - 0.04 * u_kick) + 0.5;
        float t = u_flow;

        // Domain-warped flow: two layers of noise bend the image like marbled liquid
        vec2 p = uv * 1.6;
        vec2 q = vec2(fbm(p + vec2(0.0, t * 0.6)), fbm(p + vec2(5.2, -t * 0.5)));
        vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.15),
                      fbm(p + 4.0 * q + vec2(8.3, 2.8) - t * 0.12));
        vec2 flow = (r - 0.5) * vec2(1.6, 1.0);
        uv += flow * (0.18 + 0.3 * u_bass) + vec2(t * 0.02, 0.0);

        // Hi-hats make thin horizontal bands slip sideways
        float band = floor(screen.y * 60.0);
        float tick = floor(u_time * 16.0);
        float slip = step(0.97 - 0.12 * u_high - 0.2 * u_kick, hash(vec2(band, tick)));
        uv.x += slip * (hash(vec2(band, tick + 3.0)) - 0.5) * 0.08;

        // Red/cyan fringes along the flow, wider with mids and kicks. Keeping the
        // unshifted image as the core leaves the glitches white, like the original.
        vec2 split = normalize(flow + 0.0001) * (0.002 + 0.005 * u_mid + 0.01 * u_kick);
        vec3 core = glitch(uv);
        vec3 fringe = vec3(glitch(uv + split).r, glitch(uv - split).gb);
        vec3 col = max(core * 0.9, fringe);

        float energy = 0.85 + 0.5 * u_bass + 0.6 * u_kick;
        col *= energy;
        col += (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) * 0.03;
        col *= smoothstep(1.2, 0.35, length(screen - 0.5));

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
        ["u_texture", "u_res", "u_time", "u_flow", "u_bass", "u_mid", "u_high", "u_kick", "u_dim"].forEach((name) => {
            uniforms[name] = gl.getUniformLocation(program, name);
        });
        gl.uniform1f(uniforms.u_dim, 0.55);
        gl.uniform1i(uniforms.u_texture, 0);

        // The same glitch image the page shows as its fallback background
        const texture = gl.createTexture();
        let textureReady = false;
        const image = new Image();
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
            textureReady = true;
            canvas.classList.add("ready");
        };
        image.src = GLITCH_IMAGE;

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
        let flow = 0;
        let lastFrame = start;

        function draw(now) {
            frame = requestAnimationFrame(draw);
            if (!textureReady || now - lastDraw < frameInterval) return;
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
            // The liquid speeds up with the music instead of jumping, so motion stays smooth
            const dt = Math.min(0.1, (now - lastFrame) / 1000);
            lastFrame = now;
            flow += dt * (0.12 + 0.9 * level.bass + 0.4 * level.mid);
            gl.uniform1f(uniforms.u_time, (now - start) / 1000);
            gl.uniform1f(uniforms.u_flow, flow);
            gl.uniform1f(uniforms.u_bass, level.bass);
            gl.uniform1f(uniforms.u_mid, level.mid);
            gl.uniform1f(uniforms.u_high, level.high);
            gl.uniform1f(uniforms.u_kick, level.kick);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
        frame = requestAnimationFrame(draw);

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
            image.onload = null;
            gl.deleteTexture(texture);
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
