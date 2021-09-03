import * as THREE from '../three/build/three.module.js';
import {OrbitControls} from '../three/examples/jsm/controls/OrbitControls.js';

function initScene() {
    return new THREE.Scene();
}

//TODO remove canvas
let camera;
function initCamera(canvas){
    //fov, aspect, near, far
    camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
    //TODO set the camera in the right position
    camera.position.set(0,5,32);
    camera.lookAt(0,5,0);

    // const controls = new OrbitControls(camera, canvas);
    // controls.target.set(0, 5, 0);
    // controls.update();
}

function initLights(scene) {
    let light = new THREE.AmbientLight();
    scene.add(light);

    light = new THREE.DirectionalLight();
    light.position.set(0, 20, 0);

    const shadowsEnabled = sessionStorage.getItem('shadows') || "true";
    if (shadowsEnabled === "true") {
        light.castShadow = true;
        // light.shadow.camera = new THREE.PerspectiveCamera(90, 2, 0.1, 100);
        light.shadow.camera.left = -21;
        light.shadow.camera.right = 21;
        light.shadow.camera.top = 11;
        light.shadow.camera.bottom = -11;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 28;
        light.shadow.bias = 0.0001;
        light.shadow.radius = 3;

        const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
        scene.add(cameraHelper);
    }
    scene.add(light);
}

function addLight(obj) {
    let light;
    
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default

    // light.shadow.mapSize.width = 2048;
    // light.shadow.mapSize.height = 2048;
    // light.shadow.camera.near = 1;
    // light.shadow.camera.far = 50;
    return light;
}

export { camera, initScene, initCamera, initLights }