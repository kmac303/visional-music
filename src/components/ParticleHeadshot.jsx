import { useEffect, useRef } from "react";
import * as THREE from "three";

// The headshot rebuilt as a 3D point cloud, one point per block of the photo. Where the
// cursor (or a finger) passes, points lift off and drift away in smoky wisps, then settle
// back into the face. The head also tilts a little toward the cursor. It reacts only to
// the cursor, not to the music.

// Points across the photo. The image is 1200px with ~12px blocks, so 200 keeps the
// blocky look close to the original at rest.
const GRID = 200;
// How dark a sample can be before it's left out as background
const MIN_BRIGHTNESS = 0.06;
// Size of the trail texture that remembers where the cursor has been
const TRAIL_SIZE = 96;

// Remembers where the cursor has been: each frame the old trail fades a little and a soft
// brush is drawn along the cursor's path since the last frame.
const trailFragmentShader = `
    uniform sampler2D uPrevious;
    uniform vec2 uFrom;
    uniform vec2 uTo;
    uniform float uRadius;
    uniform float uAmount;
    uniform float uDecay;
    varying vec2 vUv;

    float distanceToSegment(vec2 p, vec2 a, vec2 b) {
        vec2 ab = b - a;
        float t = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
        return length(p - (a + ab * t));
    }

    void main() {
        float previous = texture2D(uPrevious, vUv).r * uDecay;
        float brush = smoothstep(uRadius, 0.0, distanceToSegment(vUv, uFrom, uTo)) * uAmount;
        gl_FragColor = vec4(min(1.0, previous + brush), 0.0, 0.0, 1.0);
    }
`;

const passVertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
    }
`;

// Simplex noise by Ashima Arts / Stefan Gustavson (MIT), used to swirl the points
const noiseChunk = `
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
        const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }
`;

const pointsVertexShader = `
    uniform sampler2D uTrail;
    uniform float uTime;
    uniform float uPointSize;
    attribute vec2 aUv;
    attribute vec3 aColor;
    attribute float aRandom;
    varying vec3 vColor;
    varying float vFade;
    ${noiseChunk}

    void main() {
        float lift = texture2D(uTrail, aUv).r;
        // Ease in so a light touch only ripples and a full pass breaks the face apart
        lift = lift * lift * (3.0 - 2.0 * lift);

        vec3 home = position;
        vec3 swirlAt = home * 2.4 + vec3(0.0, 0.0, uTime * 0.35);
        vec3 swirl = vec3(
            snoise(swirlAt),
            snoise(swirlAt + vec3(31.4, 0.0, 0.0)),
            snoise(swirlAt + vec3(0.0, 47.2, 0.0))
        );
        // Each point travels its own distance, so the cloud spreads into wisps
        // instead of moving as one sheet
        float reach = 0.25 + aRandom * 0.75;
        vec3 drift = swirl * reach * 0.8 + vec3(0.22, 0.16, 0.7) * reach;
        vec3 moved = home + drift * lift;

        vec4 viewPosition = modelViewMatrix * vec4(moved, 1.0);
        gl_Position = projectionMatrix * viewPosition;
        // Points shrink as they fly off, which thins them into wisps
        gl_PointSize = uPointSize * (1.0 - 0.45 * lift) * (1.0 / -viewPosition.z);

        vColor = aColor;
        vFade = 1.0 - 0.55 * lift;
    }
`;

const pointsFragmentShader = `
    varying vec3 vColor;
    varying float vFade;
    void main() {
        // Square points, like the blocks in the photo
        gl_FragColor = vec4(vColor * vFade, 1.0);
    }
`;

// Reads the photo into point positions, colors and a random value per point
function buildPointCloud(image, cameraDistance) {
    const canvas = document.createElement("canvas");
    canvas.width = GRID;
    canvas.height = GRID;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, GRID, GRID);
    const pixels = context.getImageData(0, 0, GRID, GRID).data;

    const positions = [];
    const colors = [];
    const uvs = [];
    const randoms = [];
    for (let row = 0; row < GRID; row++) {
        for (let column = 0; column < GRID; column++) {
            const index = (row * GRID + column) * 4;
            const r = pixels[index] / 255;
            const g = pixels[index + 1] / 255;
            const b = pixels[index + 2] / 255;
            const brightness = Math.max(r, g, b);
            if (brightness < MIN_BRIGHTNESS) continue;

            const u = (column + 0.5) / GRID;
            const v = 1 - (row + 0.5) / GRID;
            const x = u * 2 - 1;
            const y = v * 2 - 1;
            // A gentle dome so the head has depth when it tilts, closest at the face.
            // Points pulled forward are drawn in toward the middle by the same amount the
            // camera's perspective spreads them, so at rest the face lines up with the photo.
            const dome = Math.max(0, 1 - (x * x * 1.2 + (y - 0.1) * (y - 0.1)));
            const z = dome * 0.22 + brightness * 0.04;
            const squeeze = (cameraDistance - z) / cameraDistance;
            positions.push(x * squeeze, y * squeeze, z);
            colors.push(r, g, b);
            uvs.push(u, v);
            randoms.push(Math.random());
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute("aUv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setAttribute("aRandom", new THREE.Float32BufferAttribute(randoms, 1));
    return geometry;
}

function ParticleHeadshot({ className = "" }) {
    const containerRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const image = imageRef.current;
        if (!container || !image) return;

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
        } catch {
            // No WebGL: the plain photo stays on screen
            return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // The camera sits so the flat photo exactly fills the square at rest
        const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 20);
        const cameraDistance = 1 / Math.tan(THREE.MathUtils.degToRad(20));
        camera.position.z = cameraDistance;
        const scene = new THREE.Scene();

        // Trail: two small textures swapped each frame
        const makeTarget = () => new THREE.WebGLRenderTarget(TRAIL_SIZE, TRAIL_SIZE, {
            type: THREE.HalfFloatType,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            depthBuffer: false,
        });
        let trailRead = makeTarget();
        let trailWrite = makeTarget();
        const trailMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uPrevious: { value: trailRead.texture },
                uFrom: { value: new THREE.Vector2(-1, -1) },
                uTo: { value: new THREE.Vector2(-1, -1) },
                uRadius: { value: 0.16 },
                uAmount: { value: 0 },
                uDecay: { value: 0.965 },
            },
            vertexShader: passVertexShader,
            fragmentShader: trailFragmentShader,
            depthTest: false,
            depthWrite: false,
        });
        const trailScene = new THREE.Scene();
        trailScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), trailMaterial));
        const trailCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const pointsMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTrail: { value: trailRead.texture },
                uTime: { value: 0 },
                uPointSize: { value: 1 },
            },
            vertexShader: pointsVertexShader,
            fragmentShader: pointsFragmentShader,
            depthWrite: false,
        });
        let points;
        let geometry;

        // Point size so neighboring blocks just touch at rest, like the photo
        const updateSize = () => {
            const size = container.clientWidth;
            if (!size) return;
            renderer.setSize(size, size, false);
            const devicePixels = size * renderer.getPixelRatio();
            pointsMaterial.uniforms.uPointSize.value = (devicePixels / GRID) * cameraDistance * 1.05;
            dirty = true;
        };

        // Cursor in photo coordinates (0-1, bottom-left origin), plus where it was last frame
        const pointer = { x: -1, y: -1, previousX: -1, previousY: -1, inside: false, moved: false };
        // Tilt toward the cursor, eased
        const tilt = { x: 0, y: 0, targetX: 0, targetY: 0 };
        let lastLift = 0;
        let dirty = true;
        let frameId;
        const startTime = performance.now();

        const setPointer = (clientX, clientY) => {
            const rect = container.getBoundingClientRect();
            const x = (clientX - rect.left) / rect.width;
            const y = 1 - (clientY - rect.top) / rect.height;
            if (!pointer.inside || pointer.x < 0) {
                pointer.previousX = x;
                pointer.previousY = y;
            }
            pointer.x = x;
            pointer.y = y;
            pointer.inside = true;
            pointer.moved = true;
            tilt.targetX = (x - 0.5) * 0.5;
            tilt.targetY = (y - 0.5) * 0.4;
        };
        const leave = () => {
            pointer.inside = false;
            tilt.targetX = 0;
            tilt.targetY = 0;
        };
        const handleMouseMove = (event) => setPointer(event.clientX, event.clientY);
        const handleTouch = (event) => {
            const touch = event.touches[0];
            if (touch) setPointer(touch.clientX, touch.clientY);
        };
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", leave);
        container.addEventListener("touchstart", handleTouch, { passive: true });
        container.addEventListener("touchmove", handleTouch, { passive: true });
        container.addEventListener("touchend", leave);
        container.addEventListener("touchcancel", leave);

        const resizeObserver = new ResizeObserver(updateSize);
        resizeObserver.observe(container);

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            if (!points) return;

            const tiltMoving = Math.abs(tilt.targetX - tilt.x) > 0.0005 || Math.abs(tilt.targetY - tilt.y) > 0.0005;
            // Skip the draw when everything has settled, instead of a full WebGL frame 60 times a second
            if (!pointer.moved && lastLift < 0.002 && !tiltMoving && !dirty) return;
            dirty = false;

            tilt.x += (tilt.targetX - tilt.x) * 0.06;
            tilt.y += (tilt.targetY - tilt.y) * 0.06;
            points.rotation.y = tilt.x;
            points.rotation.x = -tilt.y;

            const trail = trailMaterial.uniforms;
            trail.uPrevious.value = trailRead.texture;
            trail.uFrom.value.set(pointer.previousX, pointer.previousY);
            trail.uTo.value.set(pointer.x, pointer.y);
            trail.uAmount.value = pointer.moved ? 0.22 : 0;
            renderer.setRenderTarget(trailWrite);
            renderer.render(trailScene, trailCamera);
            renderer.setRenderTarget(null);
            [trailRead, trailWrite] = [trailWrite, trailRead];

            pointer.previousX = pointer.x;
            pointer.previousY = pointer.y;
            // Keep the trail fading for about two seconds after the last movement
            lastLift = pointer.moved ? 1 : lastLift * trail.uDecay.value;
            pointer.moved = false;

            pointsMaterial.uniforms.uTrail.value = trailRead.texture;
            pointsMaterial.uniforms.uTime.value = (performance.now() - startTime) / 1000;
            renderer.render(scene, camera);
        };

        const build = () => {
            geometry = buildPointCloud(image, cameraDistance);
            points = new THREE.Points(geometry, pointsMaterial);
            scene.add(points);
            updateSize();
            // The canvas now draws the face, so the photo underneath steps aside
            image.style.opacity = "0";
        };
        if (image.complete && image.naturalWidth) build();
        else image.addEventListener("load", build, { once: true });
        animate();

        return () => {
            cancelAnimationFrame(frameId);
            resizeObserver.disconnect();
            image.removeEventListener("load", build);
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", leave);
            container.removeEventListener("touchstart", handleTouch);
            container.removeEventListener("touchmove", handleTouch);
            container.removeEventListener("touchend", leave);
            container.removeEventListener("touchcancel", leave);
            geometry?.dispose();
            pointsMaterial.dispose();
            trailMaterial.dispose();
            trailRead.dispose();
            trailWrite.dispose();
            renderer.dispose();
            renderer.domElement.remove();
            image.style.opacity = "";
        };
    }, []);

    return (
        <div ref={containerRef} id="imageContainer" className={className}>
            <img ref={imageRef} src="/assets/Visional Headshot.jpg" alt="Kevin McIntosh, aka Visional" />
        </div>
    );
}

export default ParticleHeadshot;
