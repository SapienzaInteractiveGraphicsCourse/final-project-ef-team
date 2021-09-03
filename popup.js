document.getElementById("openMenu").onclick = function() {open()};
document.getElementById("closeMenu").onclick = function() {close()};

function open() {
    document.getElementById("popup").style.display = "block";
  }
  
  function close() {
    document.getElementById("popup").style.display = "none";
  }


/*********************************************************************************************************
                                        SETTINGS
 *********************************************************************************************************/
function setUp() {
    document.getElementById("SoundVolume").value = sessionStorage.getItem('volume') || 50;

    const brightness = parseInt(sessionStorage.getItem('brightness'));
    document.getElementById("Brightness").value = brightness || 100;
    document.body.setAttribute("style", "filter: brightness("+brightness+"%);");

    document.getElementById("Color").value = sessionStorage.getItem('color') || "#ffff00";

    if(sessionStorage.getItem('background') == 'back2') {
        document.getElementById("b1").style = 'border: 3px solid rgb(255, 255, 255);'
        document.getElementById("b2").style = 'border: 3px solid rgb(52, 51, 133);'
    }
    else {
        document.getElementById("b1").style = 'border: 3px solid rgb(52, 51, 133);'
        document.getElementById("b2").style = 'border: 3px solid rgb(255, 255, 255);'   
    }

    const shadowsEnabled = sessionStorage.getItem('shadows') || "true";
    if ( shadowsEnabled == "true"){
        document.getElementById("shadows").checked = true;
    }
    else {
        document.getElementById("shadows").checked = false;
    }
}

setUp();

document.getElementById("SoundVolume").oninput = function(){
    window.sessionStorage.setItem('volume', event.target.value);
};
document.getElementById("Brightness").oninput = function(){
    window.sessionStorage.setItem('brightness', event.target.value);
    const brightness = parseInt(event.target.value);
    document.body.setAttribute("style", "filter: brightness("+brightness+"%);");
};
document.getElementById("Color").oninput = function(){
    window.sessionStorage.setItem('color', event.target.value);
};
document.getElementById("b1").onclick = function() {
    window.sessionStorage.setItem('background', 'back1');
    document.getElementById("b1").style = 'border: 3px solid rgb(52, 51, 133);'
    document.getElementById("b2").style = 'border: 3px solid rgb(255, 255, 255);'
};
document.getElementById("b2").onclick = function() {
    window.sessionStorage.setItem('background', 'back2');
    document.getElementById("b1").style = 'border: 3px solid rgb(255, 255, 255);'
    document.getElementById("b2").style = 'border: 3px solid rgb(52, 51, 133);'
};
document.getElementById("shadows").onchange = function() {
    if (event.target.checked == true){
        window.sessionStorage.setItem('shadows', "true");
    }
    else {
        window.sessionStorage.setItem('shadows', "false");
    }
};