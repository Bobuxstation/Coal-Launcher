//load dependencies
let discoverList = document.getElementById("notmygames");
let jsonData = require(configDir + '/games.json');
let gameList = document.getElementById("mygames");
let gameProviderList = require(configDir + '/gameProviders.json');
const sanitizeHtml = require('sanitize-html');

//function for fetching market
function loadMarket(jsonURL, jsonName, search) {
  //change title to the game provider name
  discoverList.innerHTML = '<h2 style="padding-left: 10px;" id="markettitle"></h2>';
  document.getElementById('markettitle').innerText = sanitizeHtml(jsonName);
  //set refresh button
  document.getElementById('playbutton').onchange = function () {
    loadMarket(jsonURL, jsonName, document.getElementById('playbutton').value);
  }

  //fetch the JSON file
  fetch(jsonURL, { cache: "no-store" })
    .then((res) => { return res.json(); })
    .then((data) =>
      data.items.forEach(onlineitems => {

        //Create game card
        let btn = document.createElement("div");

        //Sanitize game details
        let sanitizedgamename = sanitizeHtml(onlineitems.name);
        let sanitizeddevname = sanitizeHtml(onlineitems.developer);
        let sanitizedgameinfo = sanitizeHtml(onlineitems.info);

        //set game type icons
        if (onlineitems.type == "html5" || onlineitems.type === "undefined") {
          gameextensionicon = '<i class="fa-brands fa-html5"></i> '
        } else if (onlineitems.type == "executable") {
          gameextensionicon = '<i class="fa-brands fa-windows"></i> '
        } else if (onlineitems.type == "flash") {
          gameextensionicon = '<i class="fa-solid fa-bolt"></i> '
        } else if (onlineitems.type == "link") {
          gameextensionicon = '<i class="fa-solid fa-link"></i> '
        }

        //game card layout
        btn.innerHTML =
          "<div class='gamecard1'>" + "<p>" + sanitizedgameinfo + "</p>" +
          "</div>" + "<div class='gamecard2'>" +
          "<H4>" + gameextensionicon + sanitizedgamename + "</H4>" +
          sanitizeddevname +
          "</div>";
        btn.className = "STOREGAME";
        let banner = onlineitems.banner;
        btn.style.backgroundImage = "url(" + banner + ")";

        //Download game function
        btn.onclick = function () {

          //adds game to the collection without downloading if it is a link
          if (onlineitems.type == "link") {
            let checkduplicate = JSON.stringify(jsonData).includes(sanitizedgamename);
            if (checkduplicate == true) {
              addedcollection(sanitizedgamename)
            } else {
              var obj = (jsonData);
              obj['items'].push({ "name": sanitizedgamename, "feed": sanitizeHtml(onlineitems.feed), "Version": sanitizeHtml(onlineitems.Version), "developer": sanitizeddevname, "banner": sanitizeHtml(onlineitems.banner), "dir": onlineitems.download, "type": "html5" });
              jsonStr = JSON.stringify(obj, null, "\t");
              const gameListDir = configDir + "/games.json";
              fs.writeFile(gameListDir, jsonStr, (err) => { if (err) { console.log(err); } });
              addedcollection(sanitizedgamename)
            };
          } else {
            //Check the type of the game
            if (onlineitems.type == "html5" || onlineitems.type === "undefined") {
              gameextension = ".html"
            } else if (onlineitems.type == "executable") {
              gameextension = ".exe"
            } else if (onlineitems.type == "flash") {
              gameextension = ".swf"
            }
            //Check if game exists
            let checkduplicate = JSON.stringify(jsonData).includes(sanitizedgamename);
            if (checkduplicate == true) {
              console.log('game exists! updating html file...')
              downloadgame(onlineitems.download, sanitizedgamename, gameextension);
            } else {
              downloadgame(onlineitems.download, sanitizedgamename, gameextension);
              var obj = (jsonData);
              obj['items'].push({ "name": sanitizedgamename, "feed": sanitizeHtml(onlineitems.feed), "Version": sanitizeHtml(onlineitems.Version), "developer": sanitizeddevname, "banner": sanitizeHtml(onlineitems.banner), "dir": configDir + "/games/" + sanitizedgamename + gameextension, "type": sanitizeHtml(onlineitems.type) });
              jsonStr = JSON.stringify(obj, null, "\t");
              const gameListDir = configDir + "/games.json";
              fs.writeFile(gameListDir, jsonStr, (err) => { if (err) { console.log(err); } });
            };
          }
        };

        //show game if it contains the searched query
        let searchgame = sanitizedgamename.toLowerCase()
        let searchsum = sanitizedgameinfo.toLowerCase()
        if (searchgame.includes(search) || searchsum.includes(search)) {
          discoverList.appendChild(btn);
        }
      }))
    //Show error if the user is offline
    .catch(error => { discoverList.innerHTML = '<br><h4 style="text-align: center;">Cannot load market at the moment, Check your internet connection.</h4><p style="text-align: center;">' + sanitizeHtml(error.message) + '</p>'; });
};

//Show game providers
gameProviderList.items.forEach(items => {
  let btn = document.createElement("button");
  btn.textContent = items.name;
  btn.onclick = function () {
    loadMarket(items.JSONDir, items.name, document.getElementById('playbutton').value);
  };
  gameList.appendChild(btn);
});

//Load default game provider
loadMarket("https://bobuxstation.github.io/Coal-Web/games.json", "Coal Games", document.getElementById('playbutton').value);