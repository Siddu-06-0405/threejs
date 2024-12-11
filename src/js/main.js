import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
<<<<<<< HEAD
import TWEEN from '@tweenjs/tween.js';

// Path to your .glb model
const monkeyUrl = new URL('../../assets/guj13d.glb', import.meta.url);
=======
import TWEEN from '@tweenjs/tween.js'; // Ensure TWEEN is imported

// Path to your .glb model
const monkeyUrl = new URL('../../assets/guj1.glb', import.meta.url);
>>>>>>> 0e93e1d7488359a12fa165ab8f393be8274bdae9

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

<<<<<<< HEAD
const scene = new THREE.Scene();
scene.background = new THREE.Color('#33a37b');
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

// Set up orbit controls with restrictions
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(1.37, 7.33, 10.45);
orbit.enablePan = false; // Disable right-click panning
orbit.maxPolarAngle = Math.PI / 2; // Prevent seeing bottom of model
orbit.minPolarAngle = 0;
orbit.enableDamping = true;
orbit.dampingFactor = 0.05;
orbit.minDistance = 5;
orbit.maxDistance = 15;
orbit.update();

camera.rotation.y += 0;

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

// Add directional light
=======
// Set background color for the scene
renderer.setClearColor(0xFEFEFE);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

// Set up orbit controls for camera
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(10, 10, 10);
orbit.update();  // Make sure orbit control updates after camera position is set

// Add a grid helper for better visibility of scene orientation
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);

// Add ambient light (this will light all objects evenly)
const ambientLight = new THREE.AmbientLight(0x404040, 1); // soft white light
scene.add(ambientLight);

// Add a directional light (for creating shadows and highlights)
>>>>>>> 0e93e1d7488359a12fa165ab8f393be8274bdae9
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

<<<<<<< HEAD
// Set up the asset loader
=======
// Set up the asset loader for .glb files
>>>>>>> 0e93e1d7488359a12fa165ab8f393be8274bdae9
const assetLoader = new GLTFLoader();
let model;

assetLoader.load(monkeyUrl.href, function (gltf) {
    model = gltf.scene;
    scene.add(model);

<<<<<<< HEAD
    model.traverse(function (child) {
        if (child.isMesh) {
            if (child.name === 'PlaneName') {
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xff0000,
                    roughness: 0.5,
                    metalness: 0.2
                });
            }
            child.userData.clickable = true;
        }
    });
    model.position.y -= 2;
=======
    // Loop through all meshes in the model to change the color of the plane
    model.traverse(function (child) {
        if (child.isMesh) {
            // Assuming the plane has a specific name or identifier
            if (child.name === 'PlaneName') { // Replace 'PlaneName' with the actual name of the plane in the model
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xff0000, // Change the color here
                    roughness: 0.5, // Adjust roughness if necessary
                    metalness: 0.2  // Adjust metalness if necessary
                });
            }
            child.userData.clickable = true; // Mark the building as clickable
        }
    });
>>>>>>> 0e93e1d7488359a12fa165ab8f393be8274bdae9
}, undefined, function (error) {
    console.error(error);
});

<<<<<<< HEAD
// Raycaster setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera); // Better way to update raycaster

    if (model) {
        const intersects = raycaster.intersectObject(model, true);
        if (intersects.length > 0) {
            const selectedBuilding = intersects[0].object;
            zoomToObject(selectedBuilding);
        }
    }
}

function zoomToObject(object) {
    const boundingBox = new THREE.Box3().setFromObject(object);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const distance = boundingBox.getSize(new THREE.Vector3()).length();

    const direction = new THREE.Vector3().subVectors(camera.position, center).normalize();
    const newCameraPosition = new THREE.Vector3().addVectors(center, direction.multiplyScalar(distance * 1.5));

    new TWEEN.Tween(camera.position)
        .to(newCameraPosition, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    new TWEEN.Tween(orbit.target)  // Updated to move the orbit target instead of camera position
        .to(center, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => orbit.update())
        .start();
}

function animate() {
    TWEEN.update();
    orbit.update(); // Required for smooth damping
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    console.log('Camera position:', camera.position);
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('click', onMouseClick);

orbit.addEventListener('change', () => {
    console.log('Camera position:', camera.position);
});
=======
// Raycaster and mouse position for detecting clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Function to handle mouse clicks/taps
function onMouseClick(event) {
    // Convert mouse position to normalized device coordinates (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.update();  // Fix: this line was not updating the ray correctly
    raycaster.ray.origin.setFromMatrixPosition(camera.matrixWorld);
    raycaster.ray.direction.set(mouse.x, mouse.y, 0.5).unproject(camera).sub(raycaster.ray.origin).normalize();

    // Calculate objects intersected by the ray
    const intersects = raycaster.intersectObject(model, true);

    if (intersects.length > 0) {
        const selectedBuilding = intersects[0].object; // The first intersected object
        zoomToObject(selectedBuilding);
    }
}

// Zoom to the selected building by adjusting the camera position
function zoomToObject(object) {
    const boundingBox = new THREE.Box3().setFromObject(object); // Get the bounding box of the selected object
    const center = boundingBox.getCenter(new THREE.Vector3()); // Get the center of the bounding box
    const distance = boundingBox.getSize(new THREE.Vector3()).length(); // Get the size of the object (for camera distance adjustment)

    // Calculate a new camera position that zooms in on the object
    const direction = new THREE.Vector3().subVectors(camera.position, center).normalize();
    const newCameraPosition = new THREE.Vector3().addVectors(center, direction.multiplyScalar(distance * 1.5));

    // Smoothly animate the camera position
    new TWEEN.Tween(camera.position)
        .to(newCameraPosition, 1000) // Adjust the duration as needed
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    // Update the camera look at the object
    new TWEEN.Tween(camera.position)
        .to({ x: center.x, y: center.y, z: center.z }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
}

// Animation loop to render the scene
function animate() {
    TWEEN.update(); // Update any active tweens
    renderer.render(scene, camera);
}

// Set the animation loop
renderer.setAnimationLoop(animate);

// Handle window resizing
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add an event listener for mouse clicks/taps
window.addEventListener('click', onMouseClick);
>>>>>>> 0e93e1d7488359a12fa165ab8f393be8274bdae9
