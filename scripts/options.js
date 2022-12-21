let jsonData = require(configDir + '/games.json');
let gameProviderList = require(configDir + '/gameProviders.json');

function add() {
    var obj = (jsonData);
    if (document.getElementById("feed").value == "") {
      let feed2 = "false";
      obj['items'].push({"name" : document.getElementById("name").value,"feed" : feed2, "Version" : "1", "developer" : "local", "banner" : document.getElementById("banner").value, "dir" : document.getElementById("dir").value});
    } else {
      let feed2 = document.getElementById("feed").value;
      obj['items'].push({"name" : document.getElementById("name").value,"feed" : feed2, "Version" : "1", "developer" : "local", "banner" : document.getElementById("banner").value, "dir" : document.getElementById("dir").value});
    }
    jsonStr = JSON.stringify(obj);
    console.log(jsonStr);
    fs.writeFile(configDir + '/games.json', jsonStr, (err) => { 
        if (err) { 
         console.log(err); 
        }
    });
    document.getElementById('addgame').innerHTML = 'Game Added!'
};

function changeprovider(){
  var obj = (gameProviderList);
  obj['items'].push({"name" : document.getElementById("gameprovidername").value,"JSONDir": document.getElementById("gameprovider").value});
  jsonStr = JSON.stringify(obj);
  fs.writeFile(configDir + '/gameProviders.json', jsonStr, (err) => { 
        if (err) { 
         console.log(err); 
        }
    });
    document.getElementById('gameapply').innerHTML = 'Changes Applied!'
};

function defaultprovider(){
    let jsontemplate = { "items":[{"name":"Market","JSONDir":"https://bobuxstation.github.io/Coal-Web/games.json"}],};
    let data = JSON.stringify(jsontemplate);
    fs.writeFileSync(configDir + '/gameProviders.json', data);
    document.getElementById('gamedefault').innerHTML = 'Changes Reverted!'
};

document.getElementById('versioninfo').innerHTML = "coal-launcher version " + app.getVersion() + " using electron version " + process.versions.electron + " running on " + process.platform;