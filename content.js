const addButton = document.getElementById("addButton");
addButton.addEventListener("click", addEntry);

var numEntries = 0;

populateFromSync();
chrome.storage.sync.clear();

function populateFromSync() {
    //chrome.storage.sync.clear();
    chrome.storage.sync.get(null, (items) => {
        var allKeys = Object.keys(items);
        var allValues = Object.values(items);
        for(var i = 0; i < allKeys.length; i++) {
            console.log(`key: ${allKeys[i]} value: ${allValues[i]}`);
            createEntry(allKeys[i], allValues[i]);
        }
    });
}

function addEntry() {
    var keyField = document.getElementById("keyField").value;
    var valueField = document.getElementById("valueField").value;
    document.getElementById("keyField").value = "";
    document.getElementById("valueField").value = "";
    createEntry(keyField, valueField);
}

function createEntry(key, value){
    numEntries++;
    var entryRow = document.getElementById("entryRow");

    var keyElement = document.createElement("p");
    keyElement.innerHTML = key;
    entryRow.appendChild(keyElement);
    keyElement.setAttribute("class", "keyEntry");
    keyElement.setAttribute("id", numEntries);

    var valueElement = document.createElement("input");
    valueElement.value = value;
    entryRow.appendChild(valueElement);
    valueElement.setAttribute("class", "valueEntry");
    valueElement.setAttribute("id", numEntries);

    var copyButton = document.createElement("button");
    copyButton.innerHTML = "Copy";
    entryRow.appendChild(copyButton);
    copyButton.setAttribute("class", "copyButton");
    copyButton.setAttribute("id", numEntries);
    copyButton.addEventListener("click", copyText);
    storeEntry(key, value);
}

function copyText() {
    var clickedId = this.id;
    var copyText = "";
    var valueArray = document.getElementsByClassName("valueEntry");
    for(i = 0; i < valueArray.length; i++) {
        if (valueArray[i].id == clickedId) copyText = valueArray[i].value;
    }
    this.style.backgroundColor = "darkgreen";
    navigator.clipboard.writeText(copyText);
}


function storeEntry(keyString, valueString) {
    chrome.storage.sync.set({[keyString]: valueString}, function() {
        console.log(`key set to ${keyString}`);
    });
}
