import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls.js';
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
camera.position.set(1.37, 7.33, 10.45); // Initial camera position

// MapControls setup
const controls = new MapControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth motion
controls.dampingFactor = 0.05;
controls.screenSpacePanning = true; // Pan in screen space
controls.maxPolarAngle = Math.PI / 2; // Restrict vertical angle to a top-down view
controls.minDistance = 5; // Minimum zoom distance
controls.maxDistance = 15; // Maximum zoom distance
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

// Animation loop
function animate() {
    controls.update(); // Required for damping effect
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// Handle window resize
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log('Camera position:', camera.position);
});

// Optional: Log camera position on control changes
controls.addEventListener('change', () => {
    console.log('Camera position:', camera.position);
});
