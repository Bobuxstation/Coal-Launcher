const remote = require('@electron/remote');
const app = remote.app;
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
    let jsontemplate = { 
        "items":[
        ],
        "gameprovider":"https://bobuxstation.github.io/Coal-Web/games.json",
        "achievements":"{'name':'Coal','details':'Use coal for the first time'}"
    };
     
    let data = JSON.stringify(jsontemplate);
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
        document.getElementById('gameplay').onclick = function(){
            window.open(
                "player.html?game="+items.dir+"&banner="+items.banner+"&name="+items.name,
                 '_blank', 
                 'icon= "./assets/logo.png",webviewTag=true, autoHideMenuBar= true, width= 1000, height= 600,'
                );
        };
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
    document.getElementById('gamename').innerHTML = items.name;
    document.getElementById('gamedev').innerHTML = items.developer;
    document.getElementById('gameplay').onclick = function(){
        window.open(
            "player.html?game="+items.dir+"&banner="+items.banner+"&name="+items.name,
             '_blank', 
             'icon= "./assets/logo.png",webviewTag=true, autoHideMenuBar= true, width= 1000, height= 600,'
            );
    };
    document.getElementById('gamedetails').style.display = "block";
    document.getElementById('body').style.backgroundImage = "url('" + items.banner + "')";
    if (items.feed == "false") {
        document.getElementById('gamefeed').style.display = "none";
    } else {
        document.getElementById('gamefeed').src = items.feed;
        document.getElementById('gamefeed').style.display = "block";
    }
});