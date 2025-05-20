
import { useEffect, useRef } from "react";
import * as THREE from "three";

function About() {
    const imageContainerRef = useRef(null);
    const imageRef = useRef(null);
    const canvasRef = useRef(null);

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
        
                vec2 uvOffset = strength * - mouseDirection * 0.2;
                vec2 uv = vUv - uvOffset;

                vec4 colorR = texture2D(u_texture, uv + vec2(strength * u_aberrationIntensity * 0.01, 0.0));
                vec4 colorG = texture2D(u_texture, uv);
                vec4 colorB = texture2D(u_texture, uv - vec2(strength * u_aberrationIntensity * 0.01, 0.0));

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
        
            // Initial size setup
            updateRendererSize();
        
            // Resize listener
            window.addEventListener("resize", updateRendererSize);
        }

        const texture = new THREE.TextureLoader().load(imageElement.src);
        initializeScene(texture);
        animateScene();

        function animateScene() {
            requestAnimationFrame(animateScene);
            
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

        return () => {
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
        <section className="image-text-container">
            <div ref={imageContainerRef} id="imageContainer">
                <img ref={imageRef} src="/assets/Visional Headshot.jpg" alt="Headshot" />
            </div>
            <p>
            Visional is the live visual project of Kevin McIntosh — a self-taught VJ and multimedia artist who brings music to life through immersive concert visuals (what you see on the screen).
            His journey began during the pandemic, providing weekly live visuals for a Twitch DJ collective - a formative experience that helped him develop 
            a unique visual style across a wide range of music genres, shaped by experimenting with audio-reactivity and custom camera effects in real-time.
            <br /><br />
            Drawing from his background as a music producer and DJ, Visional approaches visual performances with a deep understanding of musical flow, song structure, and 
            crowd energy. Since bringing his work to the live concert space, he's delivered audio-reactive visuals at iconic venues like Red Rocks, Legend Valley, and 
            Burning Man — translating sound into unforgettable visual journeys, one set at a time.
            </p>
        </section>
    );
}

export default About;