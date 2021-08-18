import * as THREE from '/three/build/three.module.js';
import {GLTFLoader} from '/three/examples/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from '/three/examples/jsm/loaders/OBJLoader.js';

const models = {
    bell: {url: 'res/models/bell.gltf'},
    player: {url: 'res/models/player.gltf'},
    ladder: {url: 'res/models/ladder.obj'}
};

const textures = {
    rope: {url: 'res/rope.jpg'},
    floor: {url: 'res/floor.jpg'},
    back: {url: 'res/colline-sfondo-ufficiale-xp-1280x720.jpg'}
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
    }
}

function loadResources(manager) {
    loadModels(manager);
    loadTextures(manager);
}

export { models, textures, loadResources }