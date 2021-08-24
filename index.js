import * as THREE from '/three/build/three.module.js';

import { loadResources } from './modules/loaders.mjs';
import  { player, bells, loadEasy, loadMedium, loadDifficult } from './modules/models.mjs'
import { songBell, walk } from './modules/animations.mjs';
import { initScene, initCamera, initLights } from './modules/utils.mjs';

import { startLevel } from './modules/gameManager.mjs';

import { TWEEN } from '/three/examples/jsm/libs/tween.module.min.js'
import { win } from './modules/gameManager.mjs';


/*********************************************************************************************************
                                  INITIALIZE CANVAS    
 *********************************************************************************************************/
let camera, scene, renderer, canvas;

function init(level) {
    const container = document.querySelector('#canvas');

    //scene
    scene = initScene();

    //camera
    // camera = initCamera();

    //lights
    initLights(scene);

    switch (level) {
      case 0:
        loadEasy(scene);
        break;
      case 1:
        loadMedium(scene);
        break;
      case 2:
        loadDifficult(scene);
        break;
    }

    //renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);

    canvas = renderer.domElement;
    camera = initCamera(canvas);

    container.appendChild(canvas);
    // renderer.shadowMap.enabled = true

    startLevel();

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}


/*********************************************************************************************************
                                  RENDER    
 *********************************************************************************************************/

function render() {

  TWEEN.update();
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}


/*********************************************************************************************************
                                        MAIN   
 *********************************************************************************************************/
function start(difficulty) {
  //Hide the buttons
  const chooseDifficulty = document.getElementById('difficulty');
  chooseDifficulty.style.display = 'none';

  //Display the life
  const life = document.getElementById('overLife');
  life.style.display = 'block';

  init(difficulty);
  onWindowResize();

  render();
}

//Buttons
document.getElementById("easy").onclick = function() {start(0)};
document.getElementById("medium").onclick = function() {start(1)};
document.getElementById("hard").onclick = function() {start(2)};

function main() {
  // Hide the loading bar
  const loadingElem = document.getElementById('loading');
  loadingElem.style.display = 'none';

  //Display the buttons and the best score
  const chooseDifficulty = document.getElementById('difficulty');
  chooseDifficulty.style.display = 'block';

  const best = document.getElementById('over');
  best.style.display = 'block';
}

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

//Start the game
manager.onLoad = main;

