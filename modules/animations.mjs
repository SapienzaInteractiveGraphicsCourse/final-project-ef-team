import { TWEEN } from '../three/examples/jsm/libs/tween.module.min.js'

import  { player } from './models.mjs'
import { camera } from './utils.mjs'
import { playAudio } from './audio.mjs'

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

    //e suona
    setTimeout(playAudio, 1000);
} 

/*********************************************************************************************************
                                        PLAYER   
 *********************************************************************************************************/

let haveToWalk = true;
let walkTime;
let animationTime;

function walkMovement() {
    const leftUpperArm = player.getObjectByName('UpperArmL');
    const rightUpperArm = player.getObjectByName('UpperArmR');

    const leftUpperLeg = player.getObjectByName('UpperLegL');
    const rightUpperLeg = player.getObjectByName('UpperLegR');
    const leftLowerLeg = player.getObjectByName('LowerLegL');;
    const rightLowerLeg = player.getObjectByName('LowerLegR');

    const leftFoot = player.getObjectByName('FootL');
    const rightFoot = player.getObjectByName('FootR');

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

function walk(left, target) {
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

        walkMovement();
    }
}

function walkAndTurnToTarget(left, targetX, side){
    //Walk until the right x
    walk(left, targetX);    //This set walkTime
    
    let rotation;
    if(side==='back'){
        //Turn backward
        player.rotation.y = left ? -Math.PI/2 : Math.PI/2;
        rotation = left ? -Math.PI : Math.PI;
    }
    
    new TWEEN.Tween(player.rotation).to({y:rotation}, 200).delay(walkTime).start();
    //timeout instead of onComplete for a timing reason

    animationTime = walkTime+200;
    setTimeout(function() {
        const front = side==='front'
        if(!front) {
            player.rotation.y = left ? -Math.PI : Math.PI;
        }
        stopWalk(front);},
    animationTime);
}

function stopWalk(front=true) {
    TWEEN.getAll().forEach(element => element.stop());

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

function sbra(bell) {
    const rope = bell.position.x - 4;
    //Walk to reach the rope
    const left = player.position.x > rope ? true : false;
    walkAndTurnToTarget(left, rope, 'back');    //This set animationTime
    animationTime += 5;

    //traslazione giù e poi su
    //movimento delle braccia/gambe
    setTimeout(function() {songBell(bell)}, animationTime);

    const abd = player.getObjectByName('Abdomen');
    const torso = player.getObjectByName('Torso');

    const t01 = new TWEEN.Tween(torso.rotation).to({x:Math.PI/6}, 800).start();
    const a01 = new TWEEN.Tween(abd.rotation).to({x:Math.PI/6}, 800).start();
    //Poi braccia avanti e ginocchia piegate

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

    const abd = player.getObjectByName('Abdomen');
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

    const left = player.position.x > -14.9 ? true : false;

    function goUp() {
        //Walk to reach the ladder
        walkAndTurnToTarget(left, -14.9, 'back'); //This set animationTime
        animationTime += 5;

        const stepTime = 500;

        let zStart = 7;

        setTimeout(function () {
            for(let i=-5; i<6; i++) {
                new TWEEN.Tween(player.position).to({y:i, z:zStart}, stepTime).delay(stepTime*(i+5)).easing(TWEEN.Easing.Quadratic.Out).start();
                player.position.y = i;
                player.position.z = zStart;
                zStart -= 0.2;
            }
    
            //Torso slope
            new TWEEN.Tween(abd.rotation).to({x:Math.PI/10}, 500).start();
    
            //Legs movement
            const lul01 = new TWEEN.Tween(leftUpperLeg.rotation).to({x:-Math.PI/2}, stepTime);
            const lul02 = new TWEEN.Tween(leftUpperLeg.rotation).to({x:0}, stepTime);
    
            const rul00 = new TWEEN.Tween(rightUpperLeg.rotation).to({x:0}, stepTime);
            const rul01 = new TWEEN.Tween(rightUpperLeg.rotation).to({x:-Math.PI/2}, stepTime);
            
            const lll01 = new TWEEN.Tween(leftLowerLeg.rotation).to({x:Math.PI/3, z:Math.PI/8}, stepTime);
            const lll02 = new TWEEN.Tween(leftLowerLeg.rotation).to({x:0, z:0}, stepTime);
    
            const rll00 = new TWEEN.Tween(rightLowerLeg.rotation).to({x:0, z:0}, stepTime);
            const rll01 = new TWEEN.Tween(rightLowerLeg.rotation).to({x:Math.PI/3, z:Math.PI/8}, stepTime);
    
            //Foot position
            const lf01 = new TWEEN.Tween(leftFoot.position).to({y: 1,z:1.2}, stepTime);
            const lf02 = new TWEEN.Tween(leftFoot.position).to({y: 0,z:0}, stepTime);
    
            const rf00 = new TWEEN.Tween(rightFoot.position).to({y: 0,z:0}, stepTime);
            const rf01 = new TWEEN.Tween(rightFoot.position).to({y: 1,z:1.2}, stepTime);
    
            //Concatenation
                //upper
                lul01.chain(lul02);
                lul02.chain(lul01);
                rul00.chain(rul01);
                rul01.chain(rul00);
                //lower
                lll01.chain(lll02);
                lll02.chain(lll01);
                rll00.chain(rll01);
                rll01.chain(rll00);
                //foot
                lf01.chain(lf02);
                lf02.chain(lf01);
                rf00.chain(rf01);
                rf01.chain(rf00);
    
            //Arms movement
            const rs01 = new TWEEN.Tween(rightShoulder.rotation).to({x:-Math.PI/4}, stepTime);
            const rs02 = new TWEEN.Tween(rightShoulder.rotation).to({x:0}, stepTime);
            const rua01 = new TWEEN.Tween(rightUpperArm.rotation).to({z:5*Math.PI/6}, stepTime);
            const rua02 = new TWEEN.Tween(rightUpperArm.rotation).to({z:2*Math.PI/3}, stepTime);
            const rla01 = new TWEEN.Tween(rightLowerArm.rotation).to({y:0, z:Math.PI/5}, stepTime);
            const rla02 = new TWEEN.Tween(rightLowerArm.rotation).to({y:Math.PI/12, z:Math.PI/2}, stepTime);
    
    
            const ls01 = new TWEEN.Tween(leftShoulder.rotation).to({x:0}, stepTime);
            const ls02 = new TWEEN.Tween(leftShoulder.rotation).to({x:-Math.PI/4}, stepTime);
            const lua01 = new TWEEN.Tween(leftUpperArm.rotation).to({z:-2*Math.PI/3}, stepTime);
            const lua02 = new TWEEN.Tween(leftUpperArm.rotation).to({z:-5*Math.PI/6}, stepTime);
            const lla01 = new TWEEN.Tween(leftLowerArm.rotation).to({y:0, z:-Math.PI/2}, stepTime);
            const lla02 = new TWEEN.Tween(leftLowerArm.rotation).to({y:Math.PI/12, z:-Math.PI/5}, stepTime);
    
            //Concatenation
                //Shoulder
                rs01.chain(rs02);
                rs02.chain(rs01);
                ls01.chain(ls02);
                ls02.chain(ls01);
                //Upper arm
                rua01.chain(rua02);
                rua02.chain(rua01);
                lua01.chain(lua02);
                lua02.chain(lua01);
                //Lower arm
                rla01.chain(rla02);
                rla02.chain(rla01);
                lla01.chain(lla02);
                lla02.chain(lla01);
    
            lul01.start();
            rul00.start();
            lll01.start();
            rll00.start();
            lf01.start();
            rf00.start();
    
            rs01.start();
            ls01.start();
            rua01.start();
            lua01.start();
            rla01.start();
            lla01.start();
    
            setTimeout(function() {
                for (const element of [rs01, rs02, ls01, ls02, rua01, rua02, lua01, lua02, rla01, rla02, lla01, lla02]) {
                    element.stop();
                }
                new TWEEN.Tween(rightShoulder.rotation).to({x:-Math.PI/4}, stepTime).start();
                new TWEEN.Tween(rightUpperArm.rotation).to({z:Math.PI/2}, stepTime).start();
                new TWEEN.Tween(rightLowerArm.rotation).to({y:0, z:0}, stepTime).start();
                new TWEEN.Tween(leftShoulder.rotation).to({x:-Math.PI/4}, stepTime).start();
                new TWEEN.Tween(leftUpperArm.rotation).to({z:-Math.PI/2}, stepTime).start();
                new TWEEN.Tween(leftLowerArm.rotation).to({y:0, z:0}, stepTime).start();
    
                setTimeout(function() {
                    for (const element of [lul01, lul02, lll01, lll02, lf01, lf02]) {
                        element.stop();
                    }          
                }, stepTime*2);
    
            }, stepTime*8);
    
            setTimeout(function () {
                stopClimb();

                walkMovement();
                new TWEEN.Tween(player.position).to({y:5, z:2}, 1000).start()
                .onComplete(function() {
                    stopWalk();
                });

            }, stepTime*11);

        }, animationTime);

        animationTime += stepTime*11+1000;
    }

    function goDown() {
        //Walk to reach the ladder
        walkAndTurnToTarget(left, -14.9, 'front'); //This set animationTime
        animationTime += 5;

        const jumpTime = 3000;

        setTimeout(function() {
            new TWEEN.Tween(player.position).to({y:-5, z:7}, jumpTime).delay(800).easing(TWEEN.Easing.Back.InOut).start();

            //Torso slope
            const t00 = new TWEEN.Tween(abd.rotation).to({x:Math.PI/4}, 500);
            const t01 = new TWEEN.Tween(abd.rotation).to({x:Math.PI/16}, 1000);
            const t02 = new TWEEN.Tween(abd.rotation).to({x:Math.PI/4}, 500).delay(1000);
            t00.chain(t01);
            t01.chain(t02);
            t00.start();

            //Arms movement
            const rs01 = new TWEEN.Tween(rightShoulder.rotation).to({x:Math.PI/4}, 500);
            const rs02 = new TWEEN.Tween(rightShoulder.rotation).to({x:-Math.PI/4}, 500);
            const rs03 = new TWEEN.Tween(rightShoulder.rotation).to({x:0}, 500).delay(1500);

            const ls01 = new TWEEN.Tween(leftShoulder.rotation).to({x:Math.PI/4}, 500);
            const ls02 = new TWEEN.Tween(leftShoulder.rotation).to({x:-Math.PI/4}, 500);
            const ls03 = new TWEEN.Tween(leftShoulder.rotation).to({x:0}, 500).delay(1500);

            //Concatenation
                rs01.chain(rs02);
                rs02.chain(rs03);
                ls01.chain(ls02);
                ls02.chain(ls03);
    
            rs01.start();
            ls01.start();

            //Legs movement
            const lul01 = new TWEEN.Tween(leftUpperLeg.rotation).to({x:-Math.PI/4}, 500).delay(2500);
            const lul02 = new TWEEN.Tween(leftUpperLeg.rotation).to({x:0}, 500);
    
            const rul01 = new TWEEN.Tween(rightUpperLeg.rotation).to({x:-Math.PI/4}, 500).delay(2500);
            const rul02 = new TWEEN.Tween(rightUpperLeg.rotation).to({x:0}, 500);
            
            const lll01 = new TWEEN.Tween(leftLowerLeg.rotation).to({x:Math.PI/3, z:Math.PI/8}, 500).delay(2500);
            const lll02 = new TWEEN.Tween(leftLowerLeg.rotation).to({x:0, z:0}, 500);
    
            const rll01 = new TWEEN.Tween(rightLowerLeg.rotation).to({x:Math.PI/3, z:Math.PI/8}, 500).delay(2500);
            const rll02 = new TWEEN.Tween(rightLowerLeg.rotation).to({x:0, z:0}, 500);
    
            //Concatenation
                //upper
                lul01.chain(lul02);
                rul01.chain(rul02);
                //lower
                lll01.chain(lll02);
                rll01.chain(rll02);
            
            lul01.start();
            rul01.start();
            lll01.start();
            rll01.start();

            setTimeout(function () {
                stopClimb(500);
                new TWEEN.Tween(player.position).to({y:-5, z:7}, 200).start();
            }, jumpTime);

        }, animationTime);

        animationTime += jumpTime;
    }

    if(up) {
        goDown();
    }
    else {
        goUp();
    }

}

function stopClimb(time=200) {
    TWEEN.getAll().forEach(element => element.stop());

    new TWEEN.Tween(player.getObjectByName('Abdomen').rotation).to({x:Math.PI/16}, time).start();
    new TWEEN.Tween(player.getObjectByName('UpperLegL').rotation).to({x:0}, time).start();
    new TWEEN.Tween(player.getObjectByName('LowerLegL').rotation).to({x:0, z:0}, time).start();
    new TWEEN.Tween(player.getObjectByName('FootL').position).to({y:0, z:0}, time).start();
    new TWEEN.Tween(player.getObjectByName('UpperLegR').rotation).to({x:0}, time).start();
    new TWEEN.Tween(player.getObjectByName('LowerLegR').rotation).to({x:0, z:0}, time).start();
    new TWEEN.Tween(player.getObjectByName('FootR').position).to({y:0, z:0}, time).start();
    new TWEEN.Tween(player.getObjectByName('ShoulderL').rotation).to({x:0}, time).start();
    new TWEEN.Tween(player.getObjectByName('ShoulderR').rotation).to({x:0}, time).start();
    new TWEEN.Tween(player.getObjectByName('UpperArmL').rotation).to({z:-Math.PI/2}, time).start();
    new TWEEN.Tween(player.getObjectByName('UpperArmR').rotation).to({z:Math.PI/2}, time).start();
    new TWEEN.Tween(player.getObjectByName('LowerArmL').rotation).to({y:0, z:0}, time).start();
    new TWEEN.Tween(player.getObjectByName('LowerArmR').rotation).to({y:0, z:0}, time).start();
}

export { songTime, animationTime, songBell, walk, stopWalk, climbStairs, sbra, ops, moveCamera }

