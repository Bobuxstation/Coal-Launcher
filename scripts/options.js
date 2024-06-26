//load dependencies
const path = require('path');
var themePath = jsonData.currenttheme || "css/dark.css"
document.getElementById("customthemelink").href = themePath;

function redirect(url) {
  shell.openExternal(url)
}

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
        "name": "Community Repositories",
        "JSONDir": "https://bobuxstation.github.io/Coal-Web/repositories.json"
      },
      {
        "name": "Extensions & Themes",
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
  themePath = document.getElementById("launcherstyle").value
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
  redirect(configDir + "/games.json")
}

//launch extension configuration
function openExtensionConfig() {
  redirect(configDir + "/extensions.json")
}

//launch extension configuration
function openAchievementConfig() {
  redirect(configDir + "/achievements.json")
}

//edit game provider
function editproviderjson() {
  redirect(configDir + "/gameProviders.json")
}

function openThemeFolder() {
  redirect(configDir + "/themes")
}

function openDocs() {
  redirect('https://github.com/Bobuxstation/Coal-Launcher/wiki')
}

//Get Launcher Version and updates
document.getElementById('versioninfo').innerHTML = 
app.getName() + " version: " + app.getVersion() + " <br>Electron version: " + process.versions.electron + " <br>Platform: " + process.platform;

ipcRenderer.on('update_available', () => {
  document.getElementById('updateinfo').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Downloading update...';
});

ipcRenderer.on('update_downloaded', () => {
  document.getElementById('updateinfo').innerText = 'Update downloaded! Restart the launcher to install...';
});

ipcRenderer.on('no_update_available', () => {
  document.getElementById('updateinfo').innerText = 'You are running the latest version! No need to update.';
});

//show app when finished loading
window.addEventListener('load', function () {
  document.getElementById("body").style.animation = "fadein 0.25s"
  document.getElementById("body").style.display = "block"

  setTimeout(() => {
    document.getElementById("body").style.animation = ""
  }, 250);
})