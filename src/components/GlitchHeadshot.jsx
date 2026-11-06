import { useEffect, useRef } from "react";
import * as THREE from "three";

// The headshot with a pixel-grid glitch that follows the mouse (tap on phones)
function GlitchHeadshot({ className = "" }) {
    const imageContainerRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        if (!imageContainerRef.current || !imageRef.current) return;

        const imageContainer = imageContainerRef.current;
        const imageElement = imageRef.current;

        let easeFactor = 0.02;
        let scene, camera, renderer, planeMesh;
        let mousePosition = { x: 0.5, y: 0.5 };
        let targetMousePosition = { x: 0.5, y: 0.5 };
        let prevPosition = { x: 0.5, y: 0.5 };
        let aberrationIntensity = 0.0;
        let frameId;
        let resizeHandler;
        // Only redraw when something changed, instead of a full WebGL frame 60 times a second
        let dirty = true;

        const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

        const vertexShader = `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            varying vec2 vUv;
            uniform sampler2D u_texture;    
            uniform vec2 u_mouse;
            uniform vec2 u_prevMouse;
            uniform float u_aberrationIntensity;

            void main() {
                vec2 gridUV = floor(vUv * vec2(20.0, 20.0)) / vec2(20.0, 20.0);
                vec2 centerOfPixel = gridUV + vec2(1.0/20.0, 1.0/20.0);
                
                vec2 mouseDirection = u_mouse - u_prevMouse;
                
                vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
                float pixelDistanceToMouse = length(pixelToMouseDirection);
                float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);
        
                vec2 uvOffset = strength * - mouseDirection * 0.4;
                vec2 uv = vUv - uvOffset;

                vec4 colorR = texture2D(u_texture, uv + vec2(strength * u_aberrationIntensity * 0.02, 0.0));
                vec4 colorG = texture2D(u_texture, uv);
                vec4 colorB = texture2D(u_texture, uv - vec2(strength * u_aberrationIntensity * 0.02, 0.0));

                gl_FragColor = vec4(colorR.r, colorG.g, colorB.b, 1.0);
            }
        `;

        function initializeScene(texture) {
            scene = new THREE.Scene();
        
            function updateRendererSize() {
                const width = imageElement.clientWidth;
                const height = imageElement.clientHeight;
        
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                // Resizing clears the canvas, so draw again
                dirty = true;
            }
        
            camera = new THREE.PerspectiveCamera(
                80,
                imageElement.clientWidth / imageElement.clientHeight,
                0.01,
                10
            );
            camera.position.z = 1;
        
            let shaderUniforms = {
                u_mouse: { type: "v2", value: new THREE.Vector2() },
                u_prevMouse: { type: "v2", value: new THREE.Vector2() },
                u_aberrationIntensity: { type: "f", value: 0.0 },
                u_texture: { type: "t", value: texture }
            };
        
            planeMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(2, 2),
                new THREE.ShaderMaterial({
                    uniforms: shaderUniforms,
                    vertexShader,
                    fragmentShader
                })
            );
        
            scene.add(planeMesh);
        
            renderer = new THREE.WebGLRenderer({ alpha: true });
            imageContainer.appendChild(renderer.domElement);
            requestAnimationFrame(() => {
            updateRendererSize(); // ensures the renderer aligns to the newly centered container
            });
        
            // Initial size setup
            updateRendererSize();
        
            // Resize listener
            resizeHandler = updateRendererSize;
            window.addEventListener("resize", resizeHandler);
        }

        const texture = new THREE.TextureLoader().load(imageElement.src, () => {
            dirty = true;
        });
        initializeScene(texture);
        requestAnimationFrame(() => {
        if (renderer && camera) {
            const width = imageElement.clientWidth;
            const height = imageElement.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            dirty = true;
        }
        });
        animateScene();

        function animateScene() {
            frameId = requestAnimationFrame(animateScene);

            // Skip the draw while the image is at rest: no glitch fading and the mouse settled
            const settled = aberrationIntensity === 0
                && Math.abs(targetMousePosition.x - mousePosition.x) < 0.0005
                && Math.abs(targetMousePosition.y - mousePosition.y) < 0.0005;
            if (settled && !dirty) return;
            dirty = false;

            mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor;
            mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor;

            planeMesh.material.uniforms.u_mouse.value.set(
                mousePosition.x,
                1.0 - mousePosition.y
            );

            planeMesh.material.uniforms.u_prevMouse.value.set(
                prevPosition.x,
                1.0 - prevPosition.y
            );

            aberrationIntensity = Math.max(0.0, aberrationIntensity - 0.05);
            planeMesh.material.uniforms.u_aberrationIntensity.value = aberrationIntensity;

            renderer.render(scene, camera);
        }

        function handleMouseMove(event) {
            easeFactor = 0.02;
            let rect = imageContainer.getBoundingClientRect();
            prevPosition = { ...targetMousePosition };

            targetMousePosition.x = (event.clientX - rect.left) / rect.width;
            targetMousePosition.y = (event.clientY - rect.top) / rect.height;

            aberrationIntensity = 1;
        }

        function handleMouseEnter(event) {
            easeFactor = 0.02;
            let rect = imageContainer.getBoundingClientRect();

            mousePosition.x = targetMousePosition.x = (event.clientX - rect.left) / rect.width;
            mousePosition.y = targetMousePosition.y = (event.clientY - rect.top) / rect.height;
        }

        function handleMouseLeave() {
            easeFactor = 0.05;
            targetMousePosition = { ...prevPosition };
        }

        let isEffectActive = false;
        function handleTouchStart(event) {
            event.preventDefault();
            isEffectActive = !isEffectActive;
            aberrationIntensity = isEffectActive ? 1 : 0;

            const touch = event.touches[0];
            let rect = imageContainer.getBoundingClientRect();
            targetMousePosition.x = (touch.clientX - rect.left) / rect.width;
            targetMousePosition.y = (touch.clientY - rect.top) / rect.height;
        }

        if (isMobile) {
            imageContainer.addEventListener("touchstart", handleTouchStart);
        } else {
            imageContainer.addEventListener("mousemove", handleMouseMove);
            imageContainer.addEventListener("mouseenter", handleMouseEnter);
            imageContainer.addEventListener("mouseleave", handleMouseLeave);
        }

        imageContainer.addEventListener("mousemove", handleMouseMove);
        imageContainer.addEventListener("mouseenter", handleMouseEnter);
        imageContainer.addEventListener("mouseleave", handleMouseLeave);

        const resizeObserver = new ResizeObserver(() => {
            if (renderer && camera) {
            const width = imageContainer.clientWidth;
            const height = imageContainer.clientHeight;

            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            dirty = true;
            }
        });

  resizeObserver.observe(imageContainer);

        return () => {
            // Stop the loop, or it keeps drawing after leaving the page and a new one
            // stacks up on every visit
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", resizeHandler);
            resizeObserver.disconnect();
            if (isMobile) {
                imageContainer.removeEventListener("touchstart", handleTouchStart);
            } else {
            imageContainer.removeEventListener("mousemove", handleMouseMove);
            imageContainer.removeEventListener("mouseenter", handleMouseEnter);
            imageContainer.removeEventListener("mouseleave", handleMouseLeave);
            }
            renderer.dispose();
            scene.remove(planeMesh);
        };
    }, []);

    return (
        <div ref={imageContainerRef} id="imageContainer" className={className}>
            <img ref={imageRef} src="/assets/Visional Headshot.jpg" alt="Kevin McIntosh, aka Visional" />
        </div>
    );
}

export default GlitchHeadshot;
