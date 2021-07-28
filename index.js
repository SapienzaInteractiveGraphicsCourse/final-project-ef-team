import * as THREE from '/three/build/three.module.js';

import {resizeRendererToDisplaySize} from '/canvasUtils.js'

import { models, textures, loadModels, loadTextures } from './loaders.js';
import { setUpCamera, addLight } from './utils.js';

/*********************************************************************************************************
                                        MAIN   
 *********************************************************************************************************/

function main() {
    // Hide the loading bar
    const loadingElem = document.querySelector('#loading');
    loadingElem.style.display = 'none';

    // Manage the canvas
    const canvas = document.querySelector('#gl-canvas');

    const renderer = new THREE.WebGLRenderer({canvas});
    //TODO set the camera in the right position
    const camera = setUpCamera(canvas, 0, 0, 30);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

    //Lights TODO
    let light = addLight({type:'ambient', color:0xFFFFFF, intensity:2});
    scene.add(light);
    light = addLight({type:'directional', position:[0,2,0], intensity:1});
    scene.add(light);
    light = addLight({type:'directional', position:[0,-2,0], intensity:1});
    scene.add(light);
    
    createBell(scene, left, down);
    createBell(scene, center, down);
    createBell(scene, right, down);
    createBell(scene, left, up);
    createBell(scene, center, up);
    createBell(scene, right, up);


    function render() {
        if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

  requestAnimationFrame(render);
}

/*********************************************************************************************************
                                        MODELS
 *********************************************************************************************************/

function createBell(scene, horizontal, vertical) {
    const x = horizontal*8;
    const y = vertical*12;

    let root = models['bell'].gltf.scene.clone(true);
    root = root.getObjectByName('RootNode');
	root.scale.set(3,3,3);
    //TODO per ora Z sempre 0, poi vediamo
	root.position.set(x,y,0);
    scene.add(root);

    //Add it to the global array
    let torus = root.getObjectByName("Torus");
    bells.splice(3*vertical+horizontal, 1, {bell:root, torus:torus});

    //TODO reset rotation
    // torus.rotation.x = Math.PI * (1- 1/6);
    // root.rotation.x = -Math.PI/6;

    //TODO set the rope in the right position
    //and add the horizontal piece
    const ropeGeometry = new THREE.CylinderGeometry(0.1,0.1,5);
    const ropeTexture = textures['rope'].tex;
    ropeTexture.wrapS = THREE.RepeatWrapping;
    ropeTexture.wrapT = THREE.RepeatWrapping;
    ropeTexture.repeat.set(0.2,1);
    const material = new THREE.MeshBasicMaterial({ map: ropeTexture });
    const rope = new THREE.Mesh( ropeGeometry, material );
    rope.position.set(x-2, y-2, 0);
    scene.add( rope );
}

/*********************************************************************************************************
                                        ANIMATIONS
 *********************************************************************************************************/

/*********************************************************************************************************
                                GAME LOGIC FUNCTIONS
 *********************************************************************************************************/


/*********************************************************************************************************
                                        GLOBAL
 *********************************************************************************************************/
const down=0;
const up=1;
const left=0;
const center=1;
const right=2;
let bells = new Array(6); //Like a 2x3 matrix with each element of the form {bell: Obj, torus: Obj}

const manager = new THREE.LoadingManager();

//Manage the progressBar
const progressbarElem = document.querySelector('#progressbar');
manager.onProgress = (url, itemsLoaded, itemsTotal) => {
  progressbarElem.style.width = `${itemsLoaded / itemsTotal * 100 | 0}%`;
};

//Load all the resources
loadModels(manager);
loadTextures(manager);

manager.onLoad = main;

