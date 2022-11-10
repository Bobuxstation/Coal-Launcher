const remote = require('@electron/remote');
const app = remote.app;
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
              let checkduplicate = JSON.stringify(jsonData).includes(onlineitems.name);
              if(checkduplicate == true) {
                console.log('game exists! updating html file...')
                downloadgame(onlineitems.download, onlineitems.name);
              } else {
                downloadgame(onlineitems.download, onlineitems.name);
                var obj = (jsonData);
                obj['items'].push({"name" : onlineitems.name,"feed": onlineitems.feed,"Version" : onlineitems.Version,"developer" : onlineitems.developer,"banner" : onlineitems.banner,"dir" : configDir + "/games/" + onlineitems.name + ".html"});
                jsonStr = JSON.stringify(obj);
                const gameListDir = configDir + "/games.json";
                fs.writeFile(gameListDir, jsonStr, (err) => { if (err) { console.log(err); }});
              };

            };
            discoverList.appendChild(btn);
        })
          ) 
          .catch(error => {
            discoverList.innerHTML = '<h4 style="text-align: center;">Cannot load market at the moment: ' + error.message + '</h4>';
          });