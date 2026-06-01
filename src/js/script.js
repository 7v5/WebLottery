let button = document.getElementById("btnPlay");
button.addEventListener("click", mainGame());

let chkPowerball = document.getElementById("chkPowerball");
chkPowerball.addEventListener("change", function() {
    document.getElementById("txtPowerballPick").style.display = chkPowerball.checked ? "flex" : "none";
});

function mainGame() {
    
}