import { player, bells } from './models.mjs';
import { songTime, animationTime, songBell, walk, stopWalk, climbStairs, sbra, ops } from './animations.mjs';
import { stopInteraction, setUpListener } from './userInteraction.mjs'

let life = 3;
let bestScore = 0;
let level = 0;
const initialSequence = 2;
let sequence = [];
let index = 0;
let win = false;
let difficulty;

//TODO
document.getElementById('bestScore').innerHTML = bestScore;
// document.getElementById('bestScore').innerHTML = JSON.parse(window.localStorage.getItem('bestScore')) || 0;
document.getElementById('life').innerHTML = life;

function playSequence() {
    const min = 0;
    let max;
    switch (difficulty) {
        case 0:
            max = 3;
            break;
        case 1:
            max = 4;
            break;
        case 2:
            max = 6;
    }

    for (let i=0; i<level+initialSequence; i++) {
        sequence[i] = Math.floor(Math.random() * (max - min) + min);
        if(difficulty === 0) {  //Easy mode
            if (sequence[i] === 1) { //It's the lower right bell
                sequence[i] = 2;
            }
            else if (sequence[i] === 2) { //It's the upper one
                sequence[i] = 4;
            }
        }
        else if (difficulty === 1) {    //Medium mode
            if (sequence[i] === 1) { //It's the lower right bell
                sequence[i] = 2;
            }
            else if (sequence[i] === 2) { //It's the upper left bell
                sequence[i] = 3;
            }
            else if (sequence[i] === 3) { //It's the upper right bell
                sequence[i] = 5;
            }
        }
        
        //Hard mode doesn't require adjustments
        setTimeout(function () { songBell(bells[sequence[i]]) }, i*songTime);
    }
}

function userSing() {
	let bell = undefined;
    const up = (player.position.y === 5);

    switch (difficulty) {
        case 0: //EASY mode
            if(!up){
                if(player.position.x > -8.5 && player.position.x < 2){
                    bell = bells[0];
                }
                else if (player.position.x > 7 && player.position.x < 19) {
                    bell = bells[2];
                }
            }
            else {
                if(player.position.x > -3 && player.position.x < 11.5){
                    bell = bells[4];
                }
            }
            break;

        case 1: //MEDIUM mode
            if (player.position.x > -8.5 && player.position.x < 1.5) {
                bell = bells[3*up];
            }
            else if (player.position.x > 7 && player.position.x < 19) {
                bell = bells[3*up+2];
            }
            break;

        case 2: //HARD mode
            if(!up){
                if(player.position.x > -8.5 && player.position.x < -1){
                    bell = bells[0];
                }
                else if (player.position.x > 0 && player.position.x < 6.5) {
                    bell = bells[1];
                }
                else if (player.position.x > 7 && player.position.x < 19) {
                    bell = bells[2];
                }
            }
            else {
                if(player.position.x > -8.5 && player.position.x < -1){
                    bell = bells[3];
                }
                else if (player.position.x > 1 && player.position.x < 7.5) {
                    bell = bells[4];
                }
                else if (player.position.x > 9 && player.position.x < 19) {
                    bell = bells[5];
                }
            }
            break;
    }

    if(bell) {
        const rightBell = checkBellSequence(bell);
        if(rightBell) {
            sbra(bell);
            if(!win) {
                setTimeout(setUpListener, songTime+animationTime);
            }
        }
        else {
            ops();
            setTimeout(setUpListener, animationTime);
        }
    }

    else {
        setUpListener();
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
            document.getElementById('life').innerHTML = life;
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
            // TODO save locally
            // window.localStorage.setItem('bestScore', JSON.stringify(bestScore));
            document.getElementById('bestScore').innerHTML = bestScore;
            console.log('best', bestScore)
        }

        setTimeout(startLevel, songTime);
    }
}

function loseGame() {
    level = 0;
    sequence = [];
    window.location.reload();
}

function startLevel() {
    index = 0;
    win = false;

    stopInteraction();
    setTimeout(playSequence, 500);
    const timeout = songTime * (level+initialSequence);
    setTimeout(setUpListener, timeout);
}

function startGame(customDifficulty) {
    difficulty = customDifficulty;
    startLevel();
}

export { win, startGame, userSing }