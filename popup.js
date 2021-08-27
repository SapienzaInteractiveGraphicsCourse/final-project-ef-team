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
    document.getElementById("SoundVolume").value = 30;
    document.getElementById("Brightness").value = 100;
    document.getElementById("Color").value = sessionStorage.getItem('color') || "#0000ff";
}

setUp();

document.getElementById("SoundVolume").oninput = function(){
    window.sessionStorage.setItem('volume', event.target.value);
};
document.getElementById("Brightness").oninput = function(){
    const brightness = parseInt(event.target.value);
    document.body.setAttribute("style", "filter: brightness("+brightness+"%);");
};
document.getElementById("Color").oninput = function(){
    window.sessionStorage.setItem('color', event.target.value);
};