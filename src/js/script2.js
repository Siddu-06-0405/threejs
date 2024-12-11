import * as t from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

var scene = new t.Scene();
scene.background = new t.Color(0x19d7f8);
var camera = new t.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

var renderer = new t.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new t.BoxGeometry();
var material = new t.MeshBasicMaterial({color:0x00ff00});
var cube = new t.Mesh(geometry, material);
scene.add(cube);

camera.position.z =5;

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
}

animate();