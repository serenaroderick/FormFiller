const button = document.getElementById("button");
button.addEventListener("click", addKeyTuple);

function addKeyTuple() {
    // alert()
    var keyField = document.getElementById("keyField").value;
    var valueField = document.getElementById("valueField").value;
    document.getElementById("key").innerHTML = keyField;
    document.getElementById("value").innerHTML = valueField;
}