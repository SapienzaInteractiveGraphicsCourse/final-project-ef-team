import * as THREE from '../three/build/three.module.js';
import { TWEEN } from '../three/examples/jsm/libs/tween.module.min.js'
import  { player, bells } from './models.mjs'
import { camera } from './utils.mjs'

/*********************************************************************************************************
                                        CAMERA   
 *********************************************************************************************************/
function moveCamera(inside) {
    if(inside) {
        new TWEEN.Tween(camera.position).to({x:player.position.x, y:player.position.y+3, z:15}, 500).start();

    }
    else {
        new TWEEN.Tween(camera.position).to({x:0, y:5, z:32}, 500).start();
    }
    
}

/*********************************************************************************************************
                                        BELL   
 *********************************************************************************************************/

const songTime = 3000;
function songBell(bell) {
    const root = bell.getObjectByName("RootNode");
    const clapper = bell.getObjectByName("Torus");

    //avanti e indietro come rotazione della bell
    const bell01 = new TWEEN.Tween(root.rotation).to({x:-Math.PI/3}, 1000).easing(TWEEN.Easing.Quadratic.In);
    const bell02 = new TWEEN.Tween(root.rotation).to({x:Math.PI/3}, 1000).easing(TWEEN.Easing.Quadratic.In);
    const bell03 = new TWEEN.Tween(root.rotation).to({x:0}, 500);
    bell01.chain(bell02);
    bell02.chain(bell03);
    bell01.start();

    //e del pendolo
    const clapper01 = new TWEEN.Tween(clapper.rotation).to({x:clapper.rotation.x+Math.PI/6}, 500);
    const clapper02 = new TWEEN.Tween(clapper.rotation).to({x:clapper.rotation.x-Math.PI/6}, 1000);
    const clapper03 = new TWEEN.Tween(clapper.rotation).to({x:clapper.rotation.x}, 500);
    clapper01.chain(clapper02);
    clapper02.chain(clapper03);
    clapper01.start();

    //e accendi la lucina dentro
    bell.getObjectByName('Light').intensity = 1;
    bell.getObjectByName("Torus_1").material.emissiveIntensity = 0.8;
    setTimeout(function() {
        bell.getObjectByName('Light').intensity = 0;
        bell.getObjectByName("Torus_1").material.emissiveIntensity = 0;
    }, 2500);
} 

/*********************************************************************************************************
                                        PLAYER   
 *********************************************************************************************************/

let haveToWalk = true;
let walkTime;
let animationTime;

function walk(left, target) {
    const leftUpperArm = player.getObjectByName('UpperArmL');
    const rightUpperArm = player.getObjectByName('UpperArmR');
    const leftLowerArm = player.getObjectByName('LowerArmL');
    const rightLowerArm = player.getObjectByName('LowerArmR');

    const leftUpperLeg = player.getObjectByName('UpperLegL');
    const rightUpperLeg = player.getObjectByName('UpperLegR');
    const leftLowerLeg = player.getObjectByName('LowerLegL');;
    const rightLowerLeg = player.getObjectByName('LowerLegR');
    const leftFoot = player.getObjectByName('FootL');
    const rightFoot = player.getObjectByName('FootR');

    if( haveToWalk ) {
        haveToWalk = false;

        //Translation
        let pos;
        switch (target) {
            case 'end':
                pos = left ? -18.5 : 18.5;
                break;
            default:
                pos = target;
                break;
        }
        const space = Math.abs(player.position.x - pos);
        const velocity = 0.007;
        walkTime = space/velocity;
        new TWEEN.Tween(player.position).to({x:pos}, walkTime).start();

        //Rotazione verso il lato in cui camminare
        const rotation = left ? -Math.PI/2 : Math.PI/2;
        new TWEEN.Tween(player.rotation).to({y:rotation}, 200).start();

        //Movimento delle gambe
        //Left upper leg
        const lul01 = new TWEEN.Tween(leftUpperLeg.rotation).to({x:-Math.PI/5}, 800);
        const lul02 = new TWEEN.Tween(leftUpperLeg.rotation).to({x:Math.PI/20}, 400);

        //Left lower leg
        const lll01 = new TWEEN.Tween(leftLowerLeg.rotation).to({x:Math.PI/2}, 400);
        const lll02 = new TWEEN.Tween(leftLowerLeg.rotation).to({x:0}, 400);
        const lll03 = new TWEEN.Tween(leftLowerLeg.rotation).to({x:Math.PI/6}, 400);
        
        //Left foot
        const lf01 = new TWEEN.Tween(leftFoot.position).to({y: 0.2,z:0}, 400);
        const lf02 = new TWEEN.Tween(leftFoot.position).to({y: 0.6, z:1.2}, 400);
        const lf03 = new TWEEN.Tween(leftFoot.position).to({y: 0, z:0}, 400);

        //Right upper leg
        const rul00 = new TWEEN.Tween(rightUpperLeg.rotation).to({x:0}, 500);
        const rul01 = new TWEEN.Tween(rightUpperLeg.rotation).to({x:-Math.PI/5}, 800);
        const rul02 = new TWEEN.Tween(rightUpperLeg.rotation).to({x:Math.PI/20}, 400);

        //Right lower leg
        const rll00 = new TWEEN.Tween(rightLowerLeg.rotation).to({x:0}, 500);
        const rll01 = new TWEEN.Tween(rightLowerLeg.rotation).to({x:Math.PI/2}, 400);
        const rll02 = new TWEEN.Tween(rightLowerLeg.rotation).to({x:0}, 400);
        const rll03 = new TWEEN.Tween(rightLowerLeg.rotation).to({x:Math.PI/6}, 400);

        //Right foot
        const rf00 = new TWEEN.Tween(rightFoot.position).to({y: 0,z:0}, 500);
        const rf01 = new TWEEN.Tween(rightFoot.position).to({y: 0.2,z:0}, 400);
        const rf02 = new TWEEN.Tween(rightFoot.position).to({y: 0.6, z:1.2}, 400);
        const rf03 = new TWEEN.Tween(rightFoot.position).to({y: 0, z:0}, 400);

        //Concatenation
        //upper
        lul01.chain(lul02);
        lul02.chain(lul01);
        rul00.chain(rul01);
        rul01.chain(rul02);
        rul02.chain(rul01);
        //lower
        lll01.chain(lll02);
        lll02.chain(lll03);
        lll03.chain(lll01);
        rll00.chain(rll01);
        rll01.chain(rll02);
        rll02.chain(rll03);
        rll03.chain(rll01);
        //foot
        lf01.chain(lf02);
        lf02.chain(lf03);
        lf03.chain(lf01);
        rf00.chain(rf01);
        rf01.chain(rf02);
        rf02.chain(rf03);
        rf03.chain(rf01);

        lul01.start();
        rul00.start();
        lll01.start();
        rll00.start();
        lf01.start();
        rf00.start();

        //Movimento delle braccia
        //Right upper arm
        const rua01 = new TWEEN.Tween(rightUpperArm.rotation).to({z:rightUpperArm.rotation.z+Math.PI/6}, 600);
        const rua02 = new TWEEN.Tween(rightUpperArm.rotation).to({z:rightUpperArm.rotation.z-Math.PI/6}, 600);

        //Left upper arm
        const lua01 = new TWEEN.Tween(leftUpperArm.rotation).to({z:leftUpperArm.rotation.z+Math.PI/6}, 600);
        const lua02 = new TWEEN.Tween(leftUpperArm.rotation).to({z:leftUpperArm.rotation.z-Math.PI/6}, 600);

        rua01.chain(rua02);
        rua02.chain(rua01);
        lua01.chain(lua02);
        lua02.chain(lua01);

        rua01.start();
        lua01.start();
    }
}

function stopWalk(front=true) {
    TWEEN.getAll().forEach(element => element.stop());
    const leftLowerArm = player.getObjectByName('LowerArmL');
    const rightLowerArm = player.getObjectByName('LowerArmR');

    //Re-inizialization
    haveToWalk = true;
    if(front) {
        new TWEEN.Tween(player.rotation).to({y:0}, 200).start();
    }
    new TWEEN.Tween(player.getObjectByName('UpperLegL').rotation).to({x:0}, 200).start();
    new TWEEN.Tween(player.getObjectByName('LowerLegL').rotation).to({x:0}, 200).start();
    new TWEEN.Tween(player.getObjectByName('FootL').position).to({y:0, z:0}, 200).start();
    new TWEEN.Tween(player.getObjectByName('UpperLegR').rotation).to({x:0}, 200).start();
    new TWEEN.Tween(player.getObjectByName('LowerLegR').rotation).to({x:0}, 200).start();
    new TWEEN.Tween(player.getObjectByName('FootR').position).to({y:0, z:0}, 200).start();
    new TWEEN.Tween(player.getObjectByName('UpperArmL').rotation).to({z:-Math.PI/2}, 200).start();
    new TWEEN.Tween(player.getObjectByName('UpperArmR').rotation).to({z:Math.PI/2}, 200).start();
}

function walkAndTurnToTarget(left, targetX, tagetZ){
    //Walk until the right x
    walk(left, targetX);    //This set walkTime
    //Turn backward
    player.rotation.y = left ? -Math.PI/2 : Math.PI/2;
    const rotation = left ? -Math.PI : Math.PI;
    new TWEEN.Tween(player.rotation).to({y:rotation}, 200).delay(walkTime).start();
    //timeout instead of onComplete for a timing reason

    animationTime = walkTime+200;
    setTimeout(function() {
        player.rotation.y = left ? -Math.PI : Math.PI;
        stopWalk(false);},
    animationTime);

    //Walk until the right z
}

function sbra(bell) {
    const rope = bell.position.x - 4;
    //Walk to reach the rope
    const left = player.position.x > rope ? true : false;
    walkAndTurnToTarget(left, rope);    //This set animationTime
    animationTime += 5;

    //traslazione giù e poi su
    //movimento delle braccia/gambe
    setTimeout(function() {songBell(bell)}, animationTime);
}

function ops() {
    animationTime = 3300;
    moveCamera(true);
    setTimeout(function() {moveCamera(false);}, animationTime);

    const neck = player.getObjectByName('Neck');

    //Down head
    const up00 = new TWEEN.Tween(neck.rotation).to({x:Math.PI/6}, 500);
    const up01 = new TWEEN.Tween(neck.rotation).to({x:Math.PI/6}, 2300);
    const up02 = new TWEEN.Tween(neck.rotation).to({x:0}, 500);

    //Lateral head
    const n01 = new TWEEN.Tween(neck.rotation).to({y:Math.PI/6}, 800);
    const n02 = new TWEEN.Tween(neck.rotation).to({y:-Math.PI/6}, 1000);
    const n03 = new TWEEN.Tween(neck.rotation).to({y:Math.PI/6}, 1000);
    const n04 = new TWEEN.Tween(neck.rotation).to({y:0}, 500);

    up00.chain(up01);
    up01.chain(up02);
    n01.chain(n02);
    n02.chain(n03);
    n03.chain(n04);

    up00.start();
    n01.start();
}

function climbStairs(up) {
    //Where up means the player is in the upper floor and have to come down

    //Walk to reach the ladder
    const left = player.position.x > -14 ? true : false;
    walkAndTurnToTarget(left, -14); //This set animationTime
    animationTime += 5;

    setTimeout(function(){
        player.position.y *= -1;
        player.position.z = up ? 7 : 2;
    }, animationTime);

    //traslazione su/giù e movimento gambe/braccia
    const leftShoulder = player.getObjectByName('ShoulderL');
    const rightShoulder = player.getObjectByName('ShoulderR');
    const leftUpperArm = player.getObjectByName('UpperArmL');
    const rightUpperArm = player.getObjectByName('UpperArmR');
    const leftLowerArm = player.getObjectByName('LowerArmL');
    const rightLowerArm = player.getObjectByName('LowerArmR');

    const leftUpperLeg = player.getObjectByName('UpperLegL');
    const rightUpperLeg = player.getObjectByName('UpperLegR');
    const leftLowerLeg = player.getObjectByName('LowerLegL');;
    const rightLowerLeg = player.getObjectByName('LowerLegR');
    const leftFoot = player.getObjectByName('FootL');
    const rightFoot = player.getObjectByName('FootR');

    // leftShoulder.rotation.x = -Math.PI/4;
    // rightUpperArm.rotation.z = Math.PI;
}

export { songTime, animationTime, songBell, walk, stopWalk, climbStairs, sbra, ops, moveCamera }

