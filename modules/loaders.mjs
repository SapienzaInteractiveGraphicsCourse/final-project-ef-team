import * as THREE from '../three/build/three.module.js';
import {GLTFLoader} from '../three/examples/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from '../three/examples/jsm/loaders/OBJLoader.js';

const models = {
    bell: {url: 'res/models/bell.gltf'},
    player: {url: 'res/models/player.gltf'},
    ladder: {url: 'res/models/ladder.obj'}
};

const textures = {
    rope: {url: 'res/rope.jpg'},
    floor: {url: 'res/floor.jpg'},
    wall: {url: 'res/wall.jpg'},
    normalwall: {url: 'res/wallNormalMap.png'},
    back1: {url: 'res/b1.PNG'},
    back2: {url: 'res/b2.JPG'}

}

function loadModels(manager){
    const gltfLoader = new GLTFLoader(manager);
    const objLoader = new OBJLoader(manager);

    for (const model of Object.values(models)) {
        if (model.url.split(".").pop() === "gltf") {
            gltfLoader.load(model.url, (gltf) => {
                model.gltf = gltf;
            });
        }
        else {
            objLoader.load(model.url, (obj) => {
                model.gltf = obj;
            });
        }
    }
}

function loadTextures(manager){
    const textureLoader = new THREE.TextureLoader(manager);

    for (const texture of Object.values(textures)) {
        texture.tex = textureLoader.load(texture.url);
        texture.tex.wrapS = THREE.RepeatWrapping;
        texture.tex.wrapT = THREE.RepeatWrapping;
    }
}

function loadResources(manager) {
    loadModels(manager);
    loadTextures(manager);
}

export { models, textures, loadResources }