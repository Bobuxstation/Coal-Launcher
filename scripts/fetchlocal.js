let gameList = document.getElementById("mygames");
const electron = require('electron');
console.log(configDir);
let jsonData = require(configDir + '/games.json');

jsonData.items.forEach(items => {
    let btn = document.createElement("button");
    btn.textContent = items.name;
    let banner = items.banner;
    btn.onclick = function () {
        document.getElementById('gamename').textContent = items.name;
        document.getElementById('gamedev').textContent = items.developer;
        document.getElementById('gameplay').onclick = function(){
            window.open(
                "player.html?game="+items.dir+"&banner="+items.banner+"&name="+items.name,
                 '_blank', 
                 'icon= "./assets/logo.png",nodeIntegration=true,webviewTag=true, autoHideMenuBar= true, width= 1000, height= 600,'
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
    document.getElementById('gamename').textContent = items.name;
    document.getElementById('gamedev').textContent = items.developer;
    document.getElementById('gameplay').onclick = function(){
        window.open(
            "player.html?game="+items.dir+"&banner="+items.banner+"&name="+items.name,
             '_blank', 
             'icon= "./assets/logo.png",nodeIntegration=true,webviewTag=true, autoHideMenuBar= true, width= 1000, height= 600,'
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