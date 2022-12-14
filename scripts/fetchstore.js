//load dependencies
let discoverList = document.getElementById("notmygames");
let jsonData = require(configDir + '/games.json');
let gameList = document.getElementById("mygames");
let gameProviderList = require(configDir + '/gameProviders.json');
const sanitizeHtml = require('sanitize-html');

//function for fetching market
function loadMarket(jsonURL, jsonName) {
  //change title to the game provider name
  discoverList.innerHTML = '<h2 style="padding-left: 10px;" id="markettitle"></h2>';
  document.getElementById('markettitle').innerText = jsonName;
  //fetch the JSON file
  fetch(jsonURL, {cache: "no-store"})
          .then((res) => {return res.json();})
          .then((data) => 
            data.items.forEach(onlineitems => {
            //Create game card
            let btn = document.createElement("div");
            //Sanitize game details
            let sanitizedgamename = sanitizeHtml(onlineitems.name);
            let sanitizeddevname = sanitizeHtml(onlineitems.developer);
            let sanitizedgameinfo = sanitizeHtml(onlineitems.info);
            //game card layout
            btn.innerHTML = 
              "<div class='gamecard1'>" + "<p>" + sanitizedgameinfo + "</p>" + 
              "</div>" + "<div class='gamecard2'>" +
              "<H4>" + sanitizedgamename + "</H4>" + 
              sanitizeddevname + 
              "</div>";
            btn.className = "STOREGAME";
            let banner = onlineitems.banner;
            btn.style.backgroundImage = "url(" + banner + ")";
            if (onlineitems.type == "html5") {
              gameextension = ".html"
            } else if (onlineitems.type == "executable") {
              gameextension = ".exe"
            }
            //Download game function
            btn.onclick = function () {
              //Check if game exists
              let checkduplicate = JSON.stringify(jsonData).includes(sanitizedgamename);
              if(checkduplicate == true) {
                console.log('game exists! updating html file...')
                downloadgame(onlineitems.download, sanitizedgamename, gameextension);
              } else {
                downloadgame(onlineitems.download, sanitizedgamename, gameextension);
                var obj = (jsonData);
                obj['items'].push({
                  "name" : sanitizedgamename,
                  "feed": onlineitems.feed,
                  "Version" : onlineitems.Version,
                  "developer" : sanitizeddevname,
                  "banner" : onlineitems.banner,
                  "dir" : configDir + "/games/" + sanitizedgamename + gameextension,
                  "type" : onlineitems.type
                });
                jsonStr = JSON.stringify(obj);
                const gameListDir = configDir + "/games.json";
                fs.writeFile(gameListDir, jsonStr, (err) => { if (err) { console.log(err); }});
              };

            };
            discoverList.appendChild(btn);
          })) 
          //Show error if the user is offline
          .catch(error => {discoverList.innerHTML = '<h4 style="text-align: center;">Cannot load market at the moment, Check your internet connection.</h4><p style="text-align: center;">' + error.message + '</p>';});
};

//Show game providers
gameProviderList.items.forEach(items => {
  let btn = document.createElement("button");
  btn.textContent = items.name;
  btn.onclick = function () {
    loadMarket(items.JSONDir, items.name);
  };
  gameList.appendChild(btn);
});

//Load default game provider
loadMarket("https://bobuxstation.github.io/Coal-Web/games.json", "Coal Games");