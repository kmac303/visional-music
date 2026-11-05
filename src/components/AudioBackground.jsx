import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { audioLevels } from "./audioLevels";

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
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    uniform sampler2D u_texture;
    uniform vec2 u_res;
    uniform float u_time;
    uniform float u_bass;
    uniform float u_mid;
    uniform float u_high;
    uniform vec2 u_grid;
    uniform float u_seed;
    uniform float u_amount;
    uniform float u_dim;

    float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
    }

    vec2 hash2(vec2 p) {
        return vec2(hash(p), hash(p + 17.31));
    }

    // Cover-fit the square image to the screen, drifting slowly sideways
    vec2 cover(vec2 screen) {
        return (screen - 0.5) * (u_res / max(u_res.x, u_res.y)) * 0.9 + 0.5 + vec2(u_time * 0.004, 0.0);
    }

    // Mirror-repeat so the glitch image tiles without visible seams
    vec3 glitch(vec2 uv) {
        return texture2D(u_texture, 1.0 - abs(mod(uv, 2.0) - 1.0)).rgb;
    }

    void main() {
        vec2 screen = gl_FragCoord.xy / u_res;
        vec2 uv = cover(screen);

        // Block corruption: large blocks and smaller sub-blocks jump out of place.
        // u_amount sets how many blocks break, u_grid sets their size.
        vec2 cell = floor(screen * u_grid);
        vec2 sub = floor(screen * u_grid * vec2(4.0, 3.0));
        float roll = hash(cell + u_seed);
        float subRoll = hash(sub + u_seed * 1.37);
        vec2 shift = vec2(0.0);
        float lift = 0.0;

        if (roll < u_amount * 0.45) {
            shift = (hash2(cell + u_seed + 3.1) - 0.5) * vec2(0.4, 0.1);
            lift = 0.25;
        } else if (subRoll < u_amount * 0.2) {
            shift = (hash2(sub + u_seed + 5.7) - 0.5) * vec2(0.15, 0.03);
        }

        // Some blocks smear their left edge across the whole block
        if (hash(cell + u_seed + 9.1) < u_amount * 0.15) {
            uv.x = cover(vec2(cell.x / u_grid.x, screen.y)).x;
            lift = 0.15;
        }

        // Hi-hats occasionally make thin horizontal lines slip sideways
        float line = floor(screen.y * 90.0);
        float tick = floor(u_time * 16.0);
        if (hash(vec2(line, tick)) > 0.99 - 0.05 * u_high) {
            shift.x += (hash(vec2(line, tick + 3.0)) - 0.5) * 0.05;
        }
        uv += shift;

        // Red/cyan fringes, plus blocks where only one color layer jumps
        vec2 split = vec2(0.002 + 0.003 * u_mid, 0.0);
        vec2 channel = vec2(0.0);
        if (hash(cell + u_seed + 2.2) < u_amount * 0.3) {
            channel.x = (hash(cell + u_seed + 4.4) - 0.5) * 0.06;
        }
        vec3 core = glitch(uv);
        vec3 fringe = vec3(glitch(uv + split + channel).r, glitch(uv - split - channel).gb);
        vec3 col = max(core * 0.9, fringe) * (1.0 + lift);

        col *= 0.9 + 0.2 * u_bass;
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
    const level = { bass: 0, mid: 0, high: 0, kick: 0, kicks: 0 };
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
                level.kicks += 1;
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
        ["u_texture", "u_res", "u_time", "u_bass", "u_mid", "u_high", "u_grid", "u_seed", "u_amount", "u_dim"].forEach((name) => {
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
        let lastFrame = start;
        let kicksSeen = 0;
        let amount = 0;
        let seed = 0;
        let nextRefresh = 0;
        let grid = [24, 14];

        // Bigger bass means bigger blocks; rows follow the screen shape so blocks stay wide
        function pickGrid(bass) {
            const columns = bass > 0.75 ? 6 : bass > 0.45 ? 12 : 24;
            const rows = Math.max(3, Math.round(columns * (canvas.height / canvas.width) * 1.8));
            return [columns, rows];
        }

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
            const dt = Math.min(0.1, (now - lastFrame) / 1000);
            lastFrame = now;

            // Each kick breaks a fresh set of blocks; they snap back within a fraction of a second
            if (kicksSeen < level.kicks) {
                audioLevels.kicks += level.kicks - kicksSeen;
                kicksSeen = level.kicks;
                amount = Math.max(amount, 0.5 + 0.5 * level.bass);
                grid = pickGrid(level.bass);
                seed += 1;
                nextRefresh = now + 70;
            } else if (!analyser && Math.random() < dt / 4) {
                // With no sound, an occasional small burst keeps the background alive
                amount = 0.35;
                grid = pickGrid(Math.random());
                seed += 1;
            }
            const baseline = 0.02 + 0.12 * level.bass + 0.08 * level.high;
            amount = baseline + (amount - baseline) * Math.exp(-dt / 0.18);

            // While blocks are broken, reshuffle them quickly so the corruption jitters
            if (now > nextRefresh) {
                seed += 1;
                nextRefresh = now + (amount > 0.15 ? 70 : 600);
            }

            audioLevels.bass = level.bass;
            audioLevels.mid = level.mid;
            audioLevels.high = level.high;
            audioLevels.kick = level.kick;

            gl.uniform1f(uniforms.u_time, (now - start) / 1000);
            gl.uniform1f(uniforms.u_bass, level.bass);
            gl.uniform1f(uniforms.u_mid, level.mid);
            gl.uniform1f(uniforms.u_high, level.high);
            gl.uniform2f(uniforms.u_grid, grid[0], grid[1]);
            gl.uniform1f(uniforms.u_seed, seed % 97);
            gl.uniform1f(uniforms.u_amount, amount);
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

    useEffect(() => {
        audioLevels.playing = mode !== "off";
    }, [mode]);

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
