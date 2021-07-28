import * as THREE from '/three/build/three.module.js';
import {GLTFLoader} from '/three/examples/jsm/loaders/GLTFLoader.js';

const models = {
    bell: {url: 'res/models/bell.gltf'},
    player: {url: 'https://threejsfundamentals.org/threejs/resources/models/knight/KnightCharacter.gltf'}
};

const textures = {
    rope: {url: 'res/rope.jpg'},
    floor: {url: 'res/floor.jpg'}
}

function loadModels(manager){
    const gltfLoader = new GLTFLoader(manager);

    for (const model of Object.values(models)) {
        gltfLoader.load(model.url, (gltf) => {
          model.gltf = gltf;
        });
    }
}

function loadTextures(manager){
    const textureLoader = new THREE.TextureLoader(manager);

    for (const texture of Object.values(textures)) {
        texture.tex = textureLoader.load(texture.url);
    }
}

export { models, textures, loadModels, loadTextures }