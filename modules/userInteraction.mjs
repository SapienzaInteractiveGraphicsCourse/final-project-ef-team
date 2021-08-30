import { songTime, animationTime, songBell, walk, stopWalk, climbStairs, sbra, ops } from './animations.mjs';
import  { player, bells } from './models.mjs';
import { win, userSing } from './gameManager.mjs';

let lastKey = 0;

function onKeyDown(event) {
	//When the user put a button down
	//the only accepted input is the same key up
	//or the esc key down
	stopInteraction();
	lastKey = event.keyCode;
	document.addEventListener('keyup', customKeyUp, false);

	switch ( event.keyCode ) {
		case 37: // Left
		case 65: // a
			walk(true, 'end');
			break;
		case 39: // Right
		case 68: // d
			walk(false, 'end');
			break;
		case 32: //Space
			break;
		default:
			stopInteraction();
			setUpListener();
			break;
	}
}

function escKeyDown(event) {
	if(event.keyCode === 27) { //Escape
		event.preventDefault();
		if(window.confirm("Do you really want to exit?")) {
			document.location.reload();
		}
	}
}

function onKeyUp(event) {	
	switch ( event.keyCode ) {
		case 37: // Left
		case 65: // a
		case 39: // Right
		case 68: // d
			stopWalk();
			setUpListener();
			break;
		case 32: // Space
			doSomething();
			break;
		default:
			stopInteraction();
			setUpListener();
			break;
	}
}

function customKeyUp(event) {  
	//Once the user release the key, the keyUp listener
	//has to be removed
	if(event.keyCode === lastKey) {
		document.removeEventListener( 'keyup', customKeyUp, false);
		onKeyUp(event);		
	}
}

function doSomething() {
	stopInteraction();

    if (player.position.x < -10){
        climbStairs(player.position.y === 5);
		setTimeout(setUpListener, animationTime);
    }
    else{ 
		userSing();
	}

}

export function setUpListener() {
    document.addEventListener( 'keydown', onKeyDown, false);
    document.addEventListener( 'keydown', escKeyDown, false);
}

export function stopInteraction() {
    document.removeEventListener( 'keydown', onKeyDown, false);
    document.removeEventListener( 'keyup', onKeyUp, false);
	document.removeEventListener( 'keyup', customKeyUp, false);
}