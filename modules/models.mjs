import * as THREE from '/three/build/three.module.js';
import { models, textures } from './loaders.mjs';
import { setUpListener } from './userInteraction.mjs';

const down=0;
const up=1;
const left=0;
const center=1;
const right=2;

let player;
let bells = new Array(6); //Like a 2x3 matrix

function createBell(scene, horizontal, vertical) {
    // Position
    const floor = vertical ? scene.getObjectByName('FirstFloor') : scene.getObjectByName('GroundFloor');
    const x = horizontal*9.5;
    const y = 8 + vertical*2;
    // Model
    let root = models['bell'].gltf.scene.clone(true).getObjectByName('RootNode');
	root.scale.set(6.1,6.1,6.1);
    // Light Color
    const colorString = sessionStorage.getItem('color') || 'blue';
    const color = new THREE.Color(colorString);
    // Light
    root.getObjectByName("Torus_1").material = root.getObjectByName("Torus_1").material.clone();
    root.getObjectByName("Torus_1").material.emissive = color;
    root.getObjectByName("Torus_1").material.emissiveIntensity = 0;
    const light = new THREE.PointLight(color, 0, 20, 2);
    light.name = 'Light';
    light.position.x += 17;
    root.getObjectByName("Torus").add(light);

    //TODO check dimensions
    //Rope
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

    // Shadows
    root.traverse( function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    } );

    // Adding to the scene
    const bell = new THREE.Object3D();
    bell.name = 'Bell';
	bell.position.set(x-4,y-1.2,0);
    bell.add(root);
    rope.position.set(-4, -1.1, 0);
    bell.add(rope);
    floor.add(bell);

    // Adding to the global array
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

    // Shadows
    root.traverse( function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    } );

    scene.add(root);
}

function createFloor(scene, up) {
    const planeSize = 40;
    const texture = textures['floor'].tex;
    // const repeats = planeSize / 28;
    // texture.repeat.set(repeats,1);

    const planeGeo = up ? new THREE.BoxGeometry(planeSize, 14, 2) : new THREE.PlaneGeometry(planeSize, 20);
    const planeMat = new THREE.MeshPhongMaterial({ map: texture });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;

    // Shadows
    if(up) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
    }
    else {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
    }

    const floor = new THREE.Object3D();
    floor.name = up ? 'FirstFloor' : 'GroundFloor';
    const y = -5 + 9*up;
    const z = -3*up;
    floor.position.set(0, y, z);
    floor.add(mesh);

    scene.add(floor);
}

function createWalls(scene) {
    const texture = textures['wall'].tex;
    // texture.repeat.set(repeats,1);
    const normalMap = textures['normalwall'].tex;

    const planeGeo = new THREE.PlaneGeometry(20, 30);
    // const planeMat = new THREE.MeshPhongMaterial({ map: texture, normalMap: normalMap });
    const planeMat = new THREE.MeshStandardMaterial({ map: texture, normalMap: normalMap });
    // const planeMat = new THREE.MeshStandardMaterial({ color:'pink' });
    const rightWall = new THREE.Mesh(planeGeo, planeMat);
    const leftWall = new THREE.Mesh(planeGeo, planeMat);

    rightWall.rotation.y = Math.PI * -.5;
    rightWall.position.set(20, 10, 0);
    leftWall.rotation.y = Math.PI * .5;
    leftWall.position.set(-20, 10, 0);

    // Shadows
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;

    const walls = new THREE.Object3D();
    walls.name = 'Walls';
    walls.add(rightWall);
    walls.add(leftWall);
    scene.add(walls);
}

function createBackground(scene) {
    const choosenBack = sessionStorage.getItem('background') || 'back1';
    const texture = textures[choosenBack].tex;
    const planeGeo = new THREE.PlaneGeometry(40, 30);
    const planeMat = new THREE.MeshPhongMaterial({ map: texture });
    const mesh = new THREE.Mesh(planeGeo, planeMat);

    // Shadows
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.position.set(0,10,-10);
    scene.add(mesh);
}

function createBeam(scene) {
    const texture = textures['floor'].tex;

    const planeGeo = new THREE.BoxGeometry(40, 1.5, 1);
    const planeMat = new THREE.MeshPhongMaterial({ map: texture });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;

    // Shadows
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.position.set(0,10.5,0);

    const floor = scene.getObjectByName('FirstFloor');
    floor.add(mesh);
}

function createLadder(scene) {
    let root = models['ladder'].gltf.clone();
    root.scale.set(0.01,0.01,0.01);
    root.rotation.y = Math.PI * -.5;
    const mat = new THREE.MeshPhongMaterial({color:
    0x843115});
    //0x925417});
    //0x912e17});
    //0x422424});
    root.traverse( function( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = mat;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    } );

    const ladder = new THREE.Object3D();
    ladder.name = 'Ladder';
    ladder.position.set(-14,-5,6);
    ladder.add(root);
    scene.add(ladder);
}

/*********************************************************************************************************
                                    CREATOR OF THE SCENE
 *********************************************************************************************************/

//Load all the basic elements
function loadBasic(scene) {
    setUpListener();

    scene.background = new THREE.Color('black');

    createFloor(scene, down);
    createFloor(scene, up);
    createWalls(scene);
    createBackground(scene);
    createBeam(scene);

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