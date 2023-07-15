const addButton = document.getElementById("addButton");
addButton.addEventListener("click", addClicked);

const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", searchClicked);

var numEntries = 0;

populateFromSync();
chrome.storage.sync.clear();

function populateFromSync() {
    // chrome.storage.sync.clear();
    chrome.storage.sync.get(null, (items) => {
        var allKeys = Object.keys(items);
        var allValues = Object.values(items);
        console.log('FROM SYNC ( KEY | VALUE )')
        for(var i = 0; i < allKeys.length; i++) {
            console.log(`${allKeys[i]}     |      ${allValues[i]}`);
            createEntry(allKeys[i], allValues[i]);
        }
        console.log('____________')
    });
}

function addClicked() {
    var keyField = document.getElementById("keyField").value;
    var valueField = document.getElementById("valueField").value;
    if (!valueField) {
        return;
    }
    document.getElementById("keyField").value = "";
    document.getElementById("valueField").value = "";
    createEntry(keyField, valueField);
}

function createEntry(key, value){
    numEntries++;
    var entries = document.getElementById("entries");
    var entry = document.createElement("div");
    entry.setAttribute("class", "entry");
    entry.setAttribute("id",numEntries);
    entries.appendChild(entry);

    var keyElement = document.createElement("p");
    keyElement.innerHTML = key;
    entry.appendChild(keyElement);
    keyElement.setAttribute("class", "entryKey");

    var valueElement = document.createElement("input");
    valueElement.value = value;
    entry.appendChild(valueElement);
    valueElement.setAttribute("class", "entryValue");

    var copyButton = document.createElement("button");
    copyButton.style.backgroundImage = "url('images/copy.png')";
    copyButton.setAttribute("class", "copyButton");
    copyButton.addEventListener("click", copyText);
    entry.appendChild(copyButton);

    var deleteButton = document.createElement("button");
    deleteButton.style.backgroundImage = "url('images/trash.png')";
    entry.appendChild(deleteButton);
    deleteButton.setAttribute("class", "deleteButton");
    deleteButton.addEventListener("click", deleteEntry);
    
    storeEntryToSync(key, value);
}

function copyText() {
    var entry = this.parentNode;
    var valElement = entry.getElementsByClassName("entryValue")[0];
    var copyText = valElement.value;
    copyElements = document.getElementsByClassName("copyButton");
    for (var  i = 0; i < copyElements.length; i++) {
        copyElements[i].style.backgroundColor = "black";
    }
    this.style.backgroundColor = "#023c0f";
    navigator.clipboard.writeText(copyText);
    //this.style.backgroundColor = "black";
}


function storeEntryToSync(keyString, valueString) {
    chrome.storage.sync.set({[keyString]: valueString});
}

function deleteEntry() {
    console.log('DELETE');
    var entry = this.parentNode;
    var key = entry.getElementsByClassName('entryKey')[0].innerHTML;
    chrome.storage.sync.remove(key);
    this.parentNode.remove();
}

function searchClicked() {
    var targetString = document.getElementById("searchbar").value;
    console.log(targetString);
    var targetString = document.getElementById("searchbar").value;
    // console.log(targetString);
    var keys = document.getElementsByClassName('entryKey');
    var vals = document.getElementsByClassName('entryValue');
    var toHide = [];
    for (var i = 0; i < vals.length; i++) {
        var div = keys[i].parentElement;
        var keyText = keys[i].innerHTML;
        var valText = vals[i].value;
        var allText = keyText + " " + valText;
        console.log(allText.includes(targetString));
        if (!allText.includes(targetString)) {
            toHide.push(div);
            // console.log(allText);
            //div.remove();
        }
    }

    for (i in toHide) {
        toHide[i].remove();
    }
}

function removeEntries() {
    var entriesDiv = document.getElementById('entries');
    while(entriesDiv.firstChild) {
        entriesDiv.removeChild(entriesDiv.firstChild);
    }
}