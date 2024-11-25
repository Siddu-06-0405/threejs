import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a new scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(
    75,  // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1,  // Near plane
    1000  // Far plane
);
camera.position.set(0, 2, 5); // Initial camera position

// Add OrbitControls to the camera
const orbit = new OrbitControls(camera, renderer.domElement);

// Create a grid helper (to show the ground plane)
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// Create axes helper to see the axes
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Create a rotating sphere
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xFF5733, wireframe: true });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-2, 1, 0);
scene.add(sphere);

// Create a rotating box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(2, 1, 0);
scene.add(box);

// Create a bouncing plane
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2; // Rotate the plane to be horizontal
scene.add(plane);

// Animation logic
let sphereRotationSpeed = 0.01;
let boxRotationSpeed = 0.02;
let planeDirection = 1;
let planeBounceSpeed = 0.05;

function animate() {
    // Rotate the sphere on all axes
    sphere.rotation.x += sphereRotationSpeed;
    sphere.rotation.y += sphereRotationSpeed;
    sphere.rotation.z += sphereRotationSpeed;

    // Rotate the box on all axes
    box.rotation.x += boxRotationSpeed;
    box.rotation.y += boxRotationSpeed;
    box.rotation.z += boxRotationSpeed;

    // Animate the plane (bouncing up and down)
    plane.position.y += planeDirection * planeBounceSpeed;
    if (plane.position.y > 5 || plane.position.y < -5) {
        planeDirection *= -1; // Change direction when hitting bounds
        orbit.update();
    }

    // Color change effect on the sphere and box
    let time = Date.now() * 0.002;
    sphere.material.color.setHSL((time % 1), 1, 0.5); // Rainbow effect on the sphere
    box.material.color.setHSL(((time + 0.5) % 1), 1, 0.5); // Rainbow effect on the box

    // Update controls
    orbit.update();

    // Render the scene from the perspective of the camera
    renderer.render(scene, camera);

    // Call animate again on the next frame
    renderer.setAnimationLoop(animate);
}

// Start the animation loop
animate();
