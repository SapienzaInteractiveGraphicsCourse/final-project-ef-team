import { audioListener, audio } from './loaders.mjs'

function initAudio(camera, scene) {
    const vol = sessionStorage.getItem('volume') || 50;
    audio.setVolume(vol/10);

    camera.add(audioListener);
    scene.add(audio);
}

function playAudio() {
    audio.play();
}

export { initAudio, playAudio }