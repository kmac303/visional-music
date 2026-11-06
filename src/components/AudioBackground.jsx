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

const PRECISION = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
`;

// Pass 1: builds each frame from the previous one, like a video codec with its
// refresh frames removed. Blocks of old pixels get dragged along motion vectors,
// and only some blocks are redrawn from the clean glitch image.
const moshShader = PRECISION + `
    uniform sampler2D u_texture;
    uniform sampler2D u_prev;
    uniform vec2 u_res;
    uniform float u_time;
    uniform float u_mid;
    uniform float u_high;
    uniform vec2 u_grid;
    uniform float u_seed;
    uniform float u_amount;
    uniform float u_motion;
    uniform float u_refresh;
    uniform float u_frame;
    uniform float u_field;

    float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
    }

    vec2 hash2(vec2 p) {
        return vec2(hash(p), hash(p + 17.31));
    }

    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    // Cover-fit the square image to the screen, drifting slowly sideways
    vec2 cover(vec2 screen) {
        return (screen - 0.5) * (u_res / max(u_res.x, u_res.y)) * 0.9 + 0.5 + vec2(u_time * 0.004, 0.0);
    }

    // Mirror-repeat so the glitch image tiles without visible seams
    vec3 glitch(vec2 uv) {
        return texture2D(u_texture, 1.0 - abs(mod(uv, 2.0) - 1.0)).rgb;
    }

    // The clean glitch image, with block corruption on kicks and red/cyan fringes
    vec3 fresh(vec2 screen) {
        vec2 uv = cover(screen);

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

        vec2 split = vec2(0.002 + 0.003 * u_mid, 0.0);
        vec2 channel = vec2(0.0);
        if (hash(cell + u_seed + 2.2) < u_amount * 0.3) {
            channel.x = (hash(cell + u_seed + 4.4) - 0.5) * 0.06;
        }
        vec3 core = glitch(uv);
        vec3 fringe = vec3(glitch(uv + split + channel).r, glitch(uv - split - channel).gb);
        return max(core * 0.9, fringe) * (1.0 + lift);
    }

    void main() {
        vec2 screen = gl_FragCoord.xy / u_res;

        // 8x8 pixel macroblocks, each with a motion vector from a smooth field,
        // so neighbouring blocks slide together like moving objects in a video
        vec2 block = floor(gl_FragCoord.xy / 8.0);
        vec2 motion = vec2(noise(block * 0.12 + u_field), noise(block * 0.12 + u_field + 19.7)) - 0.5;
        motion *= 2.0 * (0.4 + hash(block + u_field));

        // Whole-pixel steps keep the smears crisp instead of blurring over time
        vec2 from = gl_FragCoord.xy - floor(motion * u_motion + 0.5);
        vec3 moshed = texture2D(u_prev, from / u_res).rgb;

        // A few blocks per frame refresh from the clean image
        float refresh = step(hash(block + u_frame), u_refresh);
        gl_FragColor = vec4(mix(moshed, fresh(screen), refresh), 1.0);
    }
`;

// Pass 2: shows the moshed frame with grain, vignette, and dimming for readability
const presentShader = PRECISION + `
    uniform sampler2D u_frameTex;
    uniform vec2 u_res;
    uniform float u_time;
    uniform float u_bass;
    uniform float u_dim;

    float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
    }

    void main() {
        vec2 screen = gl_FragCoord.xy / u_res;
        vec3 col = texture2D(u_frameTex, screen).rgb;
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

function createProgram(gl, fragmentSource) {
    const vs = compile(gl, gl.VERTEX_SHADER, vertexShader);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vs || !fs) return null;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    // The shaders are owned by the program now
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    const uniforms = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
        const { name } = gl.getActiveUniform(program, i);
        uniforms[name] = gl.getUniformLocation(program, name);
    }
    return { program, uniforms, position: gl.getAttribLocation(program, "a_position") };
}

// A screen-sized texture the mosh pass can draw into and read back next frame
function createTarget(gl, width, height) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { texture, framebuffer };
}

// Turns raw FFT data into smoothed bass/mid/high levels plus a beat pulse.
// "kick" means any strong hit (kick, snare, clap), found by onset detection.
function createAnalysis() {
    const level = { bass: 0, mid: 0, high: 0, kick: 0, kicks: 0, presence: 0 };
    let bassPeak = 0;
    const peak = { bass: 0.2, mid: 0.2, high: 0.2 };
    const floor = { bass: 0, mid: 0, high: 0 };
    let previous = null;
    let fluxAverage = 0;
    let fluxSpread = 0.01;
    let lastKick = 0;

    // How much a band got louder since the last frame (spectral flux)
    function bandFlux(data, binHz, lo, hi) {
        const start = Math.max(1, Math.floor(lo / binHz));
        const end = Math.min(data.length - 1, Math.ceil(hi / binHz));
        let sum = 0;
        for (let i = start; i <= end; i++) sum += Math.max(0, data[i] - previous[i]);
        return sum / ((end - start + 1) * 255);
    }

    function bandAverage(data, binHz, lo, hi) {
        const start = Math.max(1, Math.floor(lo / binHz));
        const end = Math.min(data.length - 1, Math.ceil(hi / binHz));
        let sum = 0;
        for (let i = start; i <= end; i++) sum += data[i];
        return sum / ((end - start + 1) * 255);
    }

    function smooth(name, value) {
        // Auto-gain: stretch each band between its recent quietest and loudest points,
        // so quiet mics and loud, steady masters both swing across the full 0-1 range
        peak[name] = Math.max(value, peak[name] - (peak[name] - value) * 0.003);
        floor[name] = Math.min(value, floor[name] + (value - floor[name]) * 0.003);
        const range = Math.max(0.06, peak[name] - floor[name]);
        const normalized = Math.min(1, Math.max(0, (value - floor[name]) / range));
        const rate = normalized > level[name] ? 0.5 : 0.1;
        level[name] += (normalized - level[name]) * rate;
    }

    return {
        level,
        // fixedScale: judge bass presence on a fixed scale for mastered tracks,
        // instead of relative to what this source has sounded like so far
        update(data, binHz, now, fixedScale) {
            const bass = bandAverage(data, binHz, 30, 150);
            smooth("bass", bass);

            // Bass presence: how strong the low end is. For a mastered track, a fixed
            // scale (no presence at -36 dB, full at -28 dB) keeps a light intro calm.
            // A mic's level depends on the room, so it's judged against its own loudest
            // over the last half-minute or so instead: full near that peak, zero ~24 dB below.
            bassPeak = Math.max(bass, bassPeak - (bassPeak - bass) * 0.0006);
            // Back to decibels; matches the analyser's -90 to -5 dB range set in getContext()
            const bassDb = bass * 85 - 90;
            const presence = fixedScale
                ? Math.min(1, Math.max(0, (bassDb + 36) / 8))
                : Math.min(1, Math.max(0, (bass - (bassPeak - 0.28)) / 0.21));
            level.presence += (presence - level.presence) * (presence > level.presence ? 0.25 : 0.08);
            smooth("mid", bandAverage(data, binHz, 250, 2000));
            smooth("high", bandAverage(data, binHz, 4000, 12000));

            // A hit is a sudden rise in energy across the spectrum, weighted toward the low end,
            // that stands out from how busy the music has been lately. This catches kicks,
            // snares, and claps even when a track's sub-bass is one sustained wall.
            if (previous) {
                const flux = 0.5 * bandFlux(data, binHz, 30, 250)
                    + 0.35 * bandFlux(data, binHz, 250, 4000)
                    + 0.15 * bandFlux(data, binHz, 4000, 12000);
                const excess = flux - fluxAverage;
                fluxAverage += excess * 0.05;
                fluxSpread += (Math.abs(excess) - fluxSpread) * 0.05;
                if (excess > Math.max(0.004, fluxSpread * 3.5) && now - lastKick > 180) {
                    level.kick = 1;
                    level.kicks += 1;
                    lastKick = now;
                }
            } else {
                previous = new Uint8Array(data.length);
            }
            previous.set(data);
            level.kick *= 0.9;
        },
        decay() {
            level.bass *= 0.95;
            level.presence *= 0.95;
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
    // The background is a still frame until sound is on, so it only ever moves
    // after the visitor turns on the track or mic themselves (reduced motion included)
    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext("webgl", { antialias: false, powerPreference: "low-power" });
        if (!gl) return;

        const mosh = createProgram(gl, moshShader);
        const present = createProgram(gl, presentShader);
        if (!mosh || !present) return;

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

        function usePass(pass) {
            gl.useProgram(pass.program);
            gl.enableVertexAttribArray(pass.position);
            gl.vertexAttribPointer(pass.position, 2, gl.FLOAT, false, 0, 0);
        }

        // Texture units: 0 = glitch image, 1 = previous/current mosh frame
        usePass(mosh);
        gl.uniform1i(mosh.uniforms.u_texture, 0);
        gl.uniform1i(mosh.uniforms.u_prev, 1);
        usePass(present);
        gl.uniform1i(present.uniforms.u_frameTex, 1);
        gl.uniform1f(present.uniforms.u_dim, 0.55);

        // The same glitch image the page shows as its fallback background
        const texture = gl.createTexture();
        let textureReady = false;
        const image = new Image();
        image.onload = () => {
            gl.activeTexture(gl.TEXTURE0);
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
        // Two frames that swap each draw: read last frame from one, write the next into the other
        let targets = [];
        let readIndex = 0;
        let cleanFrame = true;
        let lastTime = 0;
        function resize() {
            const width = Math.max(1, Math.round(window.innerWidth * scale));
            const height = Math.max(1, Math.round(window.innerHeight * scale));
            if (width === canvas.width && height === canvas.height && targets.length) return;
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, width, height);
            const old = targets;
            targets = [createTarget(gl, width, height), createTarget(gl, width, height)];
            [mosh, present].forEach((pass) => {
                usePass(pass);
                gl.uniform2f(pass.uniforms.u_res, width, height);
            });
            if (old.length && !cleanFrame) {
                // Carry the frozen frame over, stretched to the new size, with no motion or refresh
                gl.bindFramebuffer(gl.FRAMEBUFFER, targets[0].framebuffer);
                usePass(mosh);
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, old[readIndex].texture);
                gl.uniform1f(mosh.uniforms.u_motion, 0);
                gl.uniform1f(mosh.uniforms.u_refresh, 0);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
                readIndex = 0;
                showFrame(0);
            }
            old.forEach(({ texture: t, framebuffer }) => {
                gl.deleteTexture(t);
                gl.deleteFramebuffer(framebuffer);
            });
        }

        // Pass 2: show the current frame on screen
        function showFrame(bass) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            usePass(present);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, targets[readIndex].texture);
            gl.uniform1f(present.uniforms.u_time, lastTime);
            gl.uniform1f(present.uniforms.u_bass, bass);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
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
        let flowOn = false;
        let field = 0;
        let frameCount = 0;

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

            // The analyser outlives a pause, so also check that sound is actually on
            const { analyser } = audioRef.current;
            const listening = Boolean(analyser) && audioLevels.playing;
            if (listening) {
                if (!data || data.length !== analyser.frequencyBinCount) {
                    data = new Uint8Array(analyser.frequencyBinCount);
                }
                analyser.getByteFrequencyData(data);
                analysis.update(data, analyser.context.sampleRate / analyser.fftSize, now, audioLevels.source === "track");
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

            // Block motion follows how much bass is present and cuts out when it's gone,
            // so the moshed image holds in place instead of drifting on
            // On above 35% presence, off below 20%, so it can't flicker at the edge
            if (!listening || level.presence < 0.2) flowOn = false;
            else if (level.presence > 0.35) flowOn = true;
            // Below about a pixel per frame only the blocks with the strongest motion round up
            // to a step, so they crawl in diagonal bands while the rest sit still. Keeping a
            // minimum speed while on, and switching straight to zero when off, makes the
            // blocks move or stop together.
            const motion = flowOn ? 1.2 + 2.1 * level.presence + 1.5 * level.kick : 0;
            // Heavy kicks send the blocks off in new directions, like a cut in a mosh edit
            if (level.kick > 0.85 && level.presence > 0.4) field += 0.37;

            // The first frame is the clean image; after that the background only changes
            // while sound is on, and freezes wherever it is when the sound stops
            if (!cleanFrame && !listening) return;

            const time = (now - start) / 1000;
            lastTime = time;
            frameCount = (frameCount + 1) % 997;

            // Pass 1: draw the next moshed frame into the write target
            const write = 1 - readIndex;
            gl.bindFramebuffer(gl.FRAMEBUFFER, targets[write].framebuffer);
            usePass(mosh);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, targets[readIndex].texture);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            const u = mosh.uniforms;
            gl.uniform1f(u.u_time, time);
            gl.uniform1f(u.u_mid, level.mid);
            gl.uniform1f(u.u_high, level.high);
            gl.uniform2f(u.u_grid, grid[0], grid[1]);
            gl.uniform1f(u.u_seed, seed % 97);
            gl.uniform1f(u.u_amount, amount);
            gl.uniform1f(u.u_motion, motion);
            // Fresh blocks of the glitch image only come in with the hits, so the music
            // is the only thing that ever refreshes it
            gl.uniform1f(u.u_refresh, cleanFrame ? 1 : 0.004 + 0.06 * level.kick);
            gl.uniform1f(u.u_frame, frameCount);
            gl.uniform1f(u.u_field, field);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            cleanFrame = false;
            readIndex = write;
            showFrame(level.bass);
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
            targets.forEach(({ texture: t, framebuffer }) => {
                gl.deleteTexture(t);
                gl.deleteFramebuffer(framebuffer);
            });
            gl.deleteBuffer(buffer);
            gl.deleteProgram(mosh.program);
            gl.deleteProgram(present.program);
        };
    }, []);

    useEffect(() => {
        audioLevels.playing = mode !== "off";
        audioLevels.source = mode;
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
            // Faster response keeps kicks sharp
            audio.analyser.smoothingTimeConstant = 0.5;
            // The default ceiling (-30 dB) is far below a mastered track's bass,
            // which would pin the readings at 100% and leave nothing to react to
            audio.analyser.minDecibels = -90;
            audio.analyser.maxDecibels = -5;
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
