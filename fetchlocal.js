const remote = require('@electron/remote');
const app = remote.app;
window.$ = window.jQuery = require('jquery');
let gameList = document.getElementById("mygames");
let discoverList = document.getElementById("notmygames");
let toolList = document.getElementById("coaltools");
let fs = require('fs');
const electron = require('electron');
const configDir =  app.getPath('userData');
console.log(configDir);

if (fs.existsSync(configDir + '/games.json')) {
    console.log('Game List Found!')
  } else {
    console.log('Game List Is Not Found! Creating Game List...')
    let student = { 
        "items":[]
    };
     
    let data = JSON.stringify(student);
    fs.writeFileSync(configDir + '/games.json', data);
  }

let jsonData = require(configDir + '/games.json');

jsonData.items.forEach(items => {
    let btn = document.createElement("button");
    btn.innerHTML = items.name;
    let banner = items.banner;
    btn.onclick = function () {
        document.getElementById('gamename').innerHTML = items.name;
        document.getElementById('gamedev').innerHTML = items.developer;
        document.getElementById('gameplay').href = "player.html?game=" + items.dir + "&banner=" + items.banner;
        document.getElementById('gamedetails').style.display = "block";
        document.getElementById('body').style.backgroundImage = "url('" + items.banner + "')";
        if (items.feed == "false") {
            document.getElementById('gamefeed').style.display = "none";
        } else {
            document.getElementById('gamefeed').src = items.feed;
            document.getElementById('gamefeed').style.display = "block";
        }
    };
    gameList.appendChild(btn);
})