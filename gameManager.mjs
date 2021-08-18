import { bells } from './models.mjs';
import { songTime, songBell } from './animations.mjs';
import { stopInteraction, setUpListener } from './userInteraction.mjs'

let life = 3;
let bestScore = 0;
let level = 0;
const initialSequence = 2;
let sequence = [];
let index = 0;
let win = false;

function playSequence() {
    for (let i=0; i<level+initialSequence; i++) {
        // const max = 6;
        const max = 3;
        const min = 0;
        sequence[i] = Math.floor(Math.random() * (max - min) + min);
        setTimeout(function () { songBell(bells[sequence[i]]) }, i*songTime);
    }
}

function checkBellSequence(bell) {
    const rightBell = (bell === bells[sequence[index]]);
    if(rightBell) {
        index += 1;
    }
    else {
        if(life === 1) {
            loseGame();
        }
        else {
            life -= 1;
        }
        return false;
    }

    checkWin();
    return true;
}

function checkWin() {
    if ( index === level+initialSequence ) {
        win = true;
        level += 1;
        if(level>bestScore) {
            bestScore = level;
            console.log('best', bestScore)
        }

        setTimeout(startLevel, songTime);
    }
}

function loseGame() {
    level = 0;
    sequence = [];
    console.log('perso')
}

function startLevel() {
    index = 0;
    win = false;

    stopInteraction();
    setTimeout(playSequence, 500);
    const timeout = songTime * (level+initialSequence);
    setTimeout(setUpListener, timeout);
}

export { win, startLevel, checkBellSequence }