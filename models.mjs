import * as THREE from '/three/build/three.module.js';
import { models, textures } from './loaders.mjs';
import { setUpListener } from './userInteraction.mjs';

const down=0;
const up=1;
const left=0;
const center=1;
const right=2;

let player;
let bells = new Array(6); //Like a 2x3 matrix with each element of the form {bell: Obj, torus: Obj}


function createBell(scene, horizontal, vertical) {
    const floor = vertical ? scene.getObjectByName('FirstFloor') : scene.getObjectByName('GroundFloor');
    const x = horizontal*9.5;
    const y = 8 + vertical*2;

    let root = models['bell'].gltf.scene.clone(true).getObjectByName('RootNode');
	root.scale.set(6.1,6.1,6.1);

    // root.getObjectByName("Torus_1").material = new THREE.MeshPhongMaterial({color:'black', emissive:'blue'});
    const light = new THREE.PointLight(0x0000FF, 0, 20, 2);
    light.name = 'Light';
    light.position.x += 17;
    const sphereSize = 15;
    const pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
    scene.add( pointLightHelper );
    root.getObjectByName("Torus").add(light);

    //TODO check dimensions
    const ropeGeometry = new THREE.CylinderGeometry(0.15,0.15,5);
    const ropeTexture = textures['rope'].tex;
    ropeTexture.wrapS = THREE.RepeatWrapping;
    ropeTexture.wrapT = THREE.RepeatWrapping;
    ropeTexture.repeat.set(0.2,1);
    const material = new THREE.MeshPhongMaterial({ map: ropeTexture });
    const ropeMesh = new THREE.Mesh( ropeGeometry, material );
    const rope = new THREE.Object3D();
    rope.name = 'Rope';
    rope.add(ropeMesh);

    const bell = new THREE.Object3D();
    bell.name = 'Bell';
	bell.position.set(x-4,y-1.2,0);
    bell.add(root);
    rope.position.set(-4, -1.1, 0);
    bell.add(rope);
    floor.add(bell);

    //Add it to the global array
    bells.splice(3*vertical+horizontal, 1, bell);
}

function createPlayer(scene) {
    let root = models['player'].gltf.scene.getObjectByName('HumanArmature');
    //TODO set the right position
    root.position.set(-9,-5,7);
    // root.position.set(-9,5,2);
    player = root;

    root.getObjectByName('ShoulderR').rotation.z = Math.PI/2;
    root.getObjectByName('ShoulderL').rotation.z = -Math.PI/2;
    root.getObjectByName('UpperArmR').rotation.y = Math.PI/12;
    root.getObjectByName('UpperArmL').rotation.y = -Math.PI/12;

    scene.add(root);
}

function createFloor(scene, up) {
    const planeSize = 40;
    const texture = textures['floor'].tex;
    texture.wrapS = THREE.RepeatWrapping;
    const repeats = planeSize / 28;
    texture.repeat.set(repeats,1);

    const planeGeo = up ? new THREE.BoxGeometry(planeSize, 12, 2) : new THREE.PlaneGeometry(planeSize, 20);
    const planeMat = new THREE.MeshPhongMaterial({ map: texture});
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;

    const floor = new THREE.Object3D();
    floor.name = up ? 'FirstFloor' : 'GroundFloor';
    const y = -5 + 9*up;
    const z = -3*up;
    floor.position.set(0, y, z);
    floor.add(mesh);

    scene.add(floor);
}

function createLadder(scene) {
    let root = models['ladder'].gltf.clone();
    root.scale.set(0.01,0.01,0.01);
    root.rotation.y = Math.PI * -.5;
    const mat = new THREE.MeshPhongMaterial({color:'brown'});
    root.traverse( function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = mat;
        }
    } );

    const ladder = new THREE.Object3D();
    ladder.name = 'Ladder';
    ladder.position.set(-14,-5,5);
    ladder.add(root);
    scene.add(ladder);
}

//Load all the basic elements
function loadBasic(scene) {
    setUpListener();

    scene.background = new THREE.Color('white');
    // scene.background = textures['back'].tex;

    createFloor(scene, down);
    createFloor(scene, up);

    createLadder(scene);

    createPlayer(scene);
}

//Load all the elements on an easy scene
//Aka basic + only 3 bells
function loadEasy(scene) {
    loadBasic(scene)
    
    createBell(scene, left, down);
    createBell(scene, right, down);
    createBell(scene, center, up);
}

//Load all the elements on an easy scene
//Aka basic + 4 bells
function loadMedium(scene) {
    loadBasic(scene)
    
    createBell(scene, left, down);
    createBell(scene, right, down);
    createBell(scene, left, up);
    createBell(scene, right, up);
}

//Load all the elements on an easy scene
//Aka basic + 6 bells
function loadDifficult(scene) {
    loadBasic(scene)
    
    createBell(scene, left, down);
    createBell(scene, center, down);
    createBell(scene, right, down);
    createBell(scene, left, up);
    createBell(scene, center, up);
    createBell(scene, right, up);
}

export { player, bells, loadEasy, loadMedium, loadDifficult }