const remote = require('@electron/remote');
const app = remote.app;
window.$ = window.jQuery = require('jquery');
let discoverList = document.getElementById("notmygames");
let fs = require('fs');
const configDir =  app.getPath('userData');
let jsonData = require(configDir + '/games.json');
let gameproviders = jsonData.gameprovider;
console.log("Launcher Directory Set To: " + configDir);
console.log("Game Provider Set To: " + gameproviders);

fetch(gameproviders)
          .then((res) => {
            return res.json();
          })
          .then((data) => 
            data.items.forEach(onlineitems => {
            let btn = document.createElement("div");
            btn.innerHTML = "<H4>" + onlineitems.name +"</H4>" + onlineitems.developer + "<BR>" + "<BR>" + onlineitems.info;
            btn.className = "STOREGAME";
            let banner = onlineitems.banner;
            btn.style.backgroundImage = "url(" + banner + ")";
            btn.onclick = function () {
                var obj = (jsonData);
                obj['items'].push(
                  {
                  "name" : onlineitems.name,
                  "feed": onlineitems.feed,
                  "Version" : onlineitems.Version,
                  "developer" : onlineitems.developer,
                  "banner" : onlineitems.banner,
                  "dir" : onlineitems.link
                  }
                  );
                jsonStr = JSON.stringify(obj);
                console.log(jsonStr);
                const gameListDir = configDir + "/games.json";
                console.log(gameListDir);
                fs.writeFile(gameListDir, jsonStr, (err) => { 
                    if (err) { 
                     console.log(err); 
                    }
                });
                window.alert('Game Added!')
            };
            discoverList.appendChild(btn);
        })
          );