import * as THREE from '../three/build/three.module.js';

import { loadResources } from './modules/loaders.mjs';
import  { player, bells, loadEasy, loadMedium, loadDifficult } from './modules/models.mjs'
import { songBell, walk } from './modules/animations.mjs';
import { initScene, initCamera, initLights } from './modules/utils.mjs';

import { startGame } from './modules/gameManager.mjs';

import { TWEEN } from '../three/examples/jsm/libs/tween.module.min.js'
import { win } from './modules/gameManager.mjs';


/*********************************************************************************************************
                                  INITIALIZE CANVAS    
 *********************************************************************************************************/
let camera, scene, renderer, canvas;
let difficulty;

function init() {
    const container = document.querySelector('#canvas');

    //scene
    scene = initScene();

    //camera
    //TODO la faccio dopo la canvas
    // camera = initCamera();

    //lights
    initLights(scene);

    switch (difficulty) {
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

    const shadowsEnabled = sessionStorage.getItem('shadows') || "true";
    if(shadowsEnabled === "true") {
      renderer.shadowMap.enabled = true;
    }

    canvas = renderer.domElement;
    camera = initCamera(canvas);

    container.appendChild(canvas);

    startGame(difficulty);

    window.addEventListener('resize', onWindowResize, false);
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
                                  UTILITY FUNCTIONS
 *********************************************************************************************************/

function onWindowResize() {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

/*********************************************************************************************************
                                        MAIN   
 *********************************************************************************************************/
function start() {
  //Hide the buttons
  const chooseDifficulty = document.getElementById('difficulty');
  chooseDifficulty.style.display = 'none';
  const settings = document.getElementById('menu');
  settings.style.display = 'none';

  //Display the life
  const life = document.getElementById('overLife');
  life.style.display = 'block';

  init();
  onWindowResize();

  render();
}

//Buttons
document.getElementById("easy").onclick = function() {
  difficulty = 0;
  start()
};
document.getElementById("medium").onclick = function() {
  difficulty = 1;
  start()
};
document.getElementById("hard").onclick = function() {
  difficulty = 2;
  start()
};

function main() {
  // Hide the loading bar
  const loadingElem = document.getElementById('loading');
  loadingElem.style.display = 'none';

  //Display the buttons and the best score
  const chooseDifficulty = document.getElementById('difficulty');
  chooseDifficulty.style.display = 'block';

  const settings = document.getElementById('menu');
  settings.style.display = 'block';

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

