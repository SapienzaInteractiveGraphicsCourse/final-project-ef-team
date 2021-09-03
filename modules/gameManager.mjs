import { player, bells } from './models.mjs';
import { songTime, animationTime, songBell, walk, stopWalk, climbStairs, sbra, ops } from './animations.mjs';
import { stopInteraction, setUpListener } from './userInteraction.mjs'

let life = 3;
let level = 0;
const initialSequence = 2;
let sequence = [];
let index = 0;
let win = false;
let difficulty;

let bestScore = JSON.parse(window.localStorage.getItem('bestScore')) || 0;
document.getElementById('bestScore').innerHTML = bestScore;
document.getElementById('life').innerHTML = life;


/******************* FUNCTION TO PLAY THE BELLS AUTONOMOUSLY *******************/
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
        //Added because of a firefox bug
        if (navigator.userAgent.includes('Firefox')) {
            setTimeout(function () {
                songBell(bells[sequence[i]]);
            }, i*songTime + songTime);
        }
        else {
            setTimeout(function () {
                songBell(bells[sequence[i]]);
            }, i*songTime);
        }
    }
}

/******************* FUNCTION TO MAKE THE USER TO PLAY THE BELLS *******************/
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
        const isTheRightBell = (bell === bells[sequence[index]]);
        if(isTheRightBell) {
            index += 1;
            sbra(bell);
            checkWin();

            if(!win) {
                setTimeout(setUpListener, songTime+animationTime);
            }
        }
        else {
            if(life === 1) {
                loseGame();
            }
            else {
                ops();
                life -= 1;
                document.getElementById('life').innerHTML = life;
                setTimeout(setUpListener, animationTime);
            }
        }
    }

    else {
        setUpListener();
    }
}

/******************* FUNCTION TO CHECK IF THE SEQUENCE HAS BEEN COMPLETED *******************/
function checkWin() {
    if ( index === level+initialSequence ) {
        win = true;
        level += 1;
        if(level>bestScore) {
            bestScore = level;
            window.localStorage.setItem('bestScore', JSON.stringify(bestScore));
        }

        setTimeout(function() {
            window.alert("Press OK to start a new level!");
            document.getElementById('bestScore').innerHTML = bestScore;
            startLevel()}, songTime+animationTime);
    }
}

/******************* FUNCTION TO SET THE END OF THE GAME *******************/
function loseGame() {
    level = 0;
    sequence = [];
    window.alert("You've lost the game!");
    window.location.reload();
}

/******************* FUNCTION TO START A NEW LEVEL *******************/
function startLevel() {
    index = 0;
    win = false;

    stopInteraction();

    let timeout;
    if (navigator.userAgent.includes('Firefox')) {
        playSequence();
        timeout = songTime * (level+initialSequence) + 2500;
    }
    else {
        setTimeout(playSequence, 500);
        timeout = songTime * (level+initialSequence) + 500;
    }

    setTimeout(setUpListener, timeout);
}

/******************* FUNCTION TO START THE GAME *******************/
function startGame(customDifficulty) {
    difficulty = customDifficulty;
    startLevel();
}

export { win, startGame, userSing }