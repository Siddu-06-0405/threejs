import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from '@tweenjs/tween.js';

// Path to your .glb model
const monkeyUrl = new URL('../../assets/guj13d.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

// Set up the asset loader
const assetLoader = new GLTFLoader();
let model;

assetLoader.load(monkeyUrl.href, function (gltf) {
    model = gltf.scene;
    scene.add(model);

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
}, undefined, function (error) {
    console.error(error);
});

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