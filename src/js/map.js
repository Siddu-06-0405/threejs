import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Path to your .glb model
const monkeyUrl = new URL('../../assets/gujarat2.glb', import.meta.url);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color('#33a37b');

// Camera setup
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0.283, 0.7137, 1.846); // Initial camera position
camera.lookAt(0, 0, 0);

const minimap = document.getElementById('minimap');
const minimapRenderer = new THREE.WebGLRenderer();
minimapRenderer.setSize(minimap.offsetWidth, minimap.offsetHeight);
minimap.appendChild(minimapRenderer.domElement);

const minimapCamera = new THREE.PerspectiveCamera(
    45,
    minimap.offsetWidth / minimap.offsetHeight,
    0.1,
    100
);

minimapCamera.position.set(0, 10, 0);
minimapCamera.lookAt(0, 0, 0);
minimapCamera.rotation.z = Math.PI;

const raycaster = new THREE.Raycaster();
const mousePosition = new THREE.Vector2();

// Smooth camera zoom state
let targetPosition = new THREE.Vector3();
let targetZoom = camera.position.distanceTo(targetPosition); // Distance for zooming
let isAnimating = false;

// Minimap click event listener with corrected mouse position calculation and eased camera movement
minimap.addEventListener('click', function(e) {
    const rect = minimapRenderer.domElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mousePosition.x = (x / minimap.clientWidth) * 2 - 1;
    mousePosition.y = -(y / minimap.clientHeight) * 2 + 1; // Corrected Y-axis

    raycaster.setFromCamera(mousePosition, minimapCamera);
    const intersects = raycaster.intersectObject(scene, true); // Check intersections with children
    if (intersects.length > 0) {
        targetPosition.set(intersects[0].point.x, 2, intersects[0].point.z); // Set the new target position
        targetZoom = camera.position.distanceTo(targetPosition); // Calculate the zoom distance
        isAnimating = true; // Start the animation
    }
});

// OrbitControls setup (allow zoom but disable rotation and panning)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth motion
controls.enableZoom = true; // Enable zooming
controls.enableRotate = false; // Disable rotation
controls.screenSpacePanning = true; // Pan in screen space
controls.maxPolarAngle = Math.PI / 2; // Restrict vertical angle to a top-down view
controls.update();

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

// Set up the asset loader
const assetLoader = new GLTFLoader();
let model;

assetLoader.load(
    monkeyUrl.href,
    function (gltf) {
        model = gltf.scene;
        scene.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

// Animation loop for the main scene with smooth zoom
function animate() {
    if (isAnimating) {
        // Smooth zoom towards the target position
        camera.position.lerp(targetPosition, 0.1); // Smoothly move towards target position

        // Stop animation if the camera is close enough to the target
        if (camera.position.distanceTo(targetPosition) < 0.1) {
            camera.position.copy(targetPosition);
            isAnimating = false; // Stop the animation
        }
    }

    controls.update(); // Required for damping effect
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// Animation loop for minimap rendering
function animate2() {
    minimapRenderer.render(scene, minimapCamera);
}

minimapRenderer.setAnimationLoop(animate2);

// Handle window resize
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    minimapCamera.aspect = minimap.offsetWidth / minimap.offsetHeight;
    minimapCamera.updateProjectionMatrix();
    minimapRenderer.setSize(minimap.offsetWidth, minimap.offsetHeight);
});
