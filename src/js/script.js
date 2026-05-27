// Game Variables


// Element Variables






var inputNum = document.getElementById("inputNum");

document.getElementById("myButton").addEventListener("click", function() {
    inputNum.style.backgroundColor = "green";
    alert("You picked: " + inputNum.innerHTML);
});