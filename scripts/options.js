//load dependencies
let jsonData = require(configDir + '/games.json');
let gameProviderList = require(configDir + '/gameProviders.json');
const { shell } = require('electron')

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
  document.getElementById('gameapply').innerText = 'Changes Applied!'
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
}

//edit game collection
function editjson() {
  shell.openExternal(configDir + "\\games.json")
}

//edit game provider
function editproviderjson() {
  shell.openExternal(configDir + "\\gameProviders.json")
}

//Get Launcher Version
document.getElementById('versioninfo').innerText = "coal-launcher version " + app.getVersion() + " using electron version " + process.versions.electron + " running on " + process.platform;