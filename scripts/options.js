//load dependencies
const path = require('path');
document.getElementById("customthemelink").href = jsonData.currenttheme || "css/dark.css";

//fetch default themes
const directoryPath = path.join(__dirname, 'css');
fs.readdir(directoryPath, function (err, files) {
  const cssFiles = files.filter(file => file.endsWith('.css'));
  const selectElement = document.getElementById('launcherstyle');
  cssFiles.forEach(file => {
    if (file.endsWith('.css') && !file.startsWith('style') && !file.startsWith('scroll')) {
      const optionElement = document.createElement('option');
      optionElement.value = "css/" + file;
      optionElement.text = "css/" + file;
      if (jsonData.currenttheme == "css/" + file) {
        optionElement.selected = true;
      }
      selectElement.appendChild(optionElement);
    }
  });
});

//search for themes from the appdata folder
function searchForThemes(folderPath) {
  fs.readdir(folderPath, function (err, files) {
    const cssFiles = files.filter(file => file.endsWith('.css'));
    const selectElement = document.getElementById('launcherstyle');
    cssFiles.forEach(file => {
      if (file.endsWith('.css') && !file.startsWith('style') && !file.startsWith('scroll')) {
        const optionElement = document.createElement('option');
        optionElement.value = folderPath + file;
        optionElement.text = folderPath + file;
        if (jsonData.currenttheme == folderPath + file) {
          optionElement.selected = true;
        }
        selectElement.appendChild(optionElement);
      }
    });
  });
};
searchForThemes(path.join(configDir, 'themes/'));

//add game function
function add() {
  var obj = (jsonData);
  if (document.getElementById("feed").value == "") {
    let feed2 = "false";
    obj['items'].push({ "name": document.getElementById("name").value, "feed": feed2, "Version": "1", "developer": "local", "banner": document.getElementById("banner").value, "dir": document.getElementById("dir").value, "type": document.getElementById("type").value });
  } else {
    let feed2 = document.getElementById("feed").value;
    obj['items'].push({ "name": document.getElementById("name").value, "feed": feed2, "Version": "1", "developer": "local", "banner": document.getElementById("banner").value, "dir": document.getElementById("dir").value, "type": document.getElementById("type").value });
  }
  jsonStr = JSON.stringify(obj, null, "\t");
  console.log(jsonStr);
  fs.writeFile(configDir + '/games.json', jsonStr, (err) => {
    if (err) {
      console.log(err);
    }
  });
  document.getElementById('addgame').innerText = 'Game Added!'
  loadCollection()
};

//change game provider
function changeprovider() {
  var obj = (gameProviderList);
  obj['items'].push({ "name": document.getElementById("gameprovidername").value, "JSONDir": document.getElementById("gameprovider").value });
  jsonStr = JSON.stringify(obj, null, "\t");
  fs.writeFile(configDir + '/gameProviders.json', jsonStr, (err) => {
    if (err) {
      console.log(err);
    }
  });
  document.getElementById('gameapply').innerText = 'Changes Applied! (Restart launcher to see changes)'
};

//reset game provider
function defaultprovider() {
  let jsontemplate = {
    "items": [
      {
        "name": "Coal Games",
        "JSONDir": "https://bobuxstation.github.io/Coal-Web/games.json"
      },
      {
        "name": "Community Games",
        "JSONDir": "https://bobuxstation.github.io/Coal-Web/communitygames.json"
      },
      {
        "name": "Extensions",
        "JSONDir": "https://bobuxstation.github.io/Coal-Web/extensions.json"
      }
    ],
  };
  let data = JSON.stringify(jsontemplate, null, "\t");
  fs.writeFileSync(configDir + '/gameProviders.json', data);
  document.getElementById('gamedefault').innerText = 'Changes Reverted!'
};

function settheme() {
  jsonData.currenttheme = document.getElementById("launcherstyle").value;
  newsettings = JSON.stringify(jsonData, null, "\t");
  fs.writeFile(configDir + '/games.json', newsettings, (err) => {
    if (err) {
      console.log(err);
    }
  });
  document.getElementById('applytheme').innerText = 'Theme Applied!'
  document.getElementById("customthemelink").href = document.getElementById("launcherstyle").value;
}

function setEmulator() {
  jsonData.preferredEmulator = document.getElementById("preferredEmulator").value;
  newsettings = JSON.stringify(jsonData, null, "\t");
  fs.writeFile(configDir + '/games.json', newsettings, (err) => {
    if (err) {
      console.log(err);
    }
  });
  document.getElementById('applyEmulator').innerText = 'Changes Applied!'
}
document.getElementById('preferredEmulator').value = jsonData.preferredEmulator || "wine"

//edit game collection
function editjson() {
  shell.openExternal(configDir + "/games.json")
}

//launch extension configuration
function openExtensionConfig() {
  shell.openExternal(configDir + "/extensions.json")
}

//edit game provider
function editproviderjson() {
  shell.openExternal(configDir + "/gameProviders.json")
}

function openThemeFolder() {
  shell.openExternal(configDir + "/themes")
}

function openDocs() {
  shell.openExternal('https://github.com/Bobuxstation/Coal-Launcher/wiki')
}

//Get Launcher Version
document.getElementById('versioninfo').innerText = app.getName() + " version " + app.getVersion() + " using electron version " + process.versions.electron + " running on " + process.platform;