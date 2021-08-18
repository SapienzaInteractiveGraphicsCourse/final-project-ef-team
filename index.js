import * as THREE from '/three/build/three.module.js';

import {resizeRendererToDisplaySize} from '/canvasUtils.js'

import { loadResources } from './loaders.mjs';
import  { player, bells, loadEasy, loadMedium, loadDifficult } from './models.mjs'
import { songBell, walk } from './animations.mjs';
import { initScene, initCamera, initLights } from './utils.mjs';

import { startLevel } from './gameManager.mjs';

import { TWEEN } from '/three/examples/jsm/libs/tween.module.min.js'

/*********************************************************************************************************
                                        MAIN   
 *********************************************************************************************************/

function main() {
    // Hide the loading bar
    const loadingElem = document.querySelector('#loading');
    loadingElem.style.display = 'none';

    // Manage the canvas
    const canvas = document.querySelector('#gl-canvas');

    const scene = initScene();
    const camera = initCamera(canvas);
    const renderer = new THREE.WebGLRenderer({canvas});

    initLights(scene);

    // loadEasy(scene);
    // loadMedium(scene);
    loadDifficult(scene);

    startLevel();


    function render() {
        if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        }

        TWEEN.update()

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}


// window.addEventListener('resize', onWindowResize, false)
// function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight
//     camera.updateProjectionMatrix()
//     renderer.setSize(window.innerWidth, window.innerHeight)
//     render()
// }

/*********************************************************************************************************
                                        GLOBAL
 *********************************************************************************************************/
const manager = new THREE.LoadingManager();

//Manage the progressBar
const progressbarElem = document.querySelector('#progressbar');
manager.onProgress = (url, itemsLoaded, itemsTotal) => {
  progressbarElem.style.width = `${itemsLoaded / itemsTotal * 100 | 0}%`;
};

//Load all the resources
loadResources(manager);

manager.onLoad = main;

