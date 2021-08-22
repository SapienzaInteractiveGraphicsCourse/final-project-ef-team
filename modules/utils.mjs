import * as THREE from '/three/build/three.module.js';
import {OrbitControls} from '/three/examples/jsm/controls/OrbitControls.js';

function initScene() {
    return new THREE.Scene();
}

//TODO remove canvas
function initCamera(canvas){
    //fov, aspect, near, far
    const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
    //TODO set the camera in the right position
    camera.position.set(0,0,30);
    //camera.lookAt();

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    return camera;
}

function initLights(scene) {
    //Lights TODO
    let light = addLight({type:'ambient', color:0xFFFFFF, intensity:1});
    scene.add(light);
    light = addLight({type:'directional', position:[0,2,0], intensity:1});
    scene.add(light);
}

function addLight(obj) {
    const type = obj.type || 'ambient';
    const color = obj.color || 0xFFFFFF;
    const intensity = obj.intensity || 1;
    const pos = obj.position || [0,0,0];

    let light;
    switch(type) {
        case 'ambient':
            light = new THREE.AmbientLight(color, intensity);
            break;
        case 'directional':
            light = new THREE.DirectionalLight(color, intensity);
            light.position.set(pos[0], pos[1], pos[2]);
            break;
        case 'point':
            light = new THREE.PointLight(color);
            light.position.set(pos[0], pos[1], pos[2]);
            break;
    }

    //TODO choose for the shadows
    // light.castShadow = true;
    // light.shadow.mapSize.width = 2048;
    // light.shadow.mapSize.height = 2048;

    // const d = 50;
    // light.shadow.camera.left = -d;
    // light.shadow.camera.right = d;
    // light.shadow.camera.top = d;
    // light.shadow.camera.bottom = -d;
    // light.shadow.camera.near = 1;
    // light.shadow.camera.far = 50;
    // light.shadow.bias = 0.001;
    return light;
}

export { initScene, initCamera, initLights }