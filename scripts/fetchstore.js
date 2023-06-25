//load dependencies
let discoverList = document.getElementById("notmygames");
let providerList = document.getElementById("myproviders");
let gameProviderList = require(configDir + '/gameProviders.json');
const sanitizeHtml = require('sanitize-html');
let lastDownloadsBackground

//function for fetching market
function loadMarket(jsonURL, jsonName, search) {
  //change title to the game provider name
  discoverList.innerHTML = '';
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
        } else if (onlineitems.type == "extension") {
          gameextensionicon = '<i class="fa-solid fa-puzzle-piece"></i> '
        } else if (onlineitems.type == "theme") {
          gameextensionicon = '<i class="fa-solid fa-paintbrush"></i> '
        }

        //game card layout
        btn.innerHTML =
          "</div>" + "<div class='gamecard'>" +
          "<h3>" + gameextensionicon + sanitizedgamename + "</h3>" +
          sanitizeddevname +
          `<br><br><p title="${sanitizedgameinfo}">` + sanitizedgameinfo.slice(0, 128) + "...</p></div>";
        btn.className = "STOREGAME";
        let banner = onlineitems.banner;
        btn.style.backgroundImage = "url(" + banner + ")";

        //Download game function
        btn.onclick = function () {
          document.getElementById('downloadname').innerText = sanitizedgamename;
          document.getElementById('downloaddev').innerText = sanitizeddevname;
          document.getElementById('downloaddesc').innerText = sanitizedgameinfo;
          lastDownloadsBackground = banner;
          document.getElementById('detailbtn').click();

          document.getElementById('downloadgamebutton').onclick = function () {
            let clickSound = new Audio("assets/toggle_002.ogg")
            clickSound.volume = 0.1;
            clickSound.play()

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
                loadCollection()
              };

              //installs the game as an extension if it is an extension
            } else if (onlineitems.type == "extension") {
              let checkduplicate = JSON.stringify(tabList).includes(sanitizedgamename);
              if (checkduplicate == true) {
                extensionadded(sanitizedgamename)
              } else {
                var obj = (tabList);
                obj['extensions'].push({ "name": sanitizedgamename, "icon": onlineitems.icon, "URL": onlineitems.link, });
                jsonStr = JSON.stringify(obj, null, "\t");
                const gameListDir = configDir + "/extensions.json";
                fs.writeFile(gameListDir, jsonStr, (err) => { if (err) { console.log(err); } });
                extensionadded(sanitizedgamename)
              };

              //only download it to the themes folder if its a theme
            } else if (onlineitems.type == "theme") {
              downloadFileToThemeFolder(onlineitems).then(
                function (value) {
                  extensionadded(sanitizedgamename)
                }
              )
            } else {
              //Check if game exists
              let checkduplicate = JSON.stringify(jsonData).includes(sanitizedgamename);
              if (checkduplicate == true) {
                console.log('game exists! updating html file...')
                downloadgame(onlineitems);
              } else {
                downloadgame(onlineitems).then(
                  function (value) {
                    var obj = (jsonData);
                    obj['items'].push({
                      "name": sanitizedgamename,
                      "feed": sanitizeHtml(onlineitems.feed),
                      "Version": sanitizeHtml(onlineitems.Version),
                      "developer": sanitizeddevname,
                      "banner": sanitizeHtml(onlineitems.banner),
                      "dir": configDir + "/games/" + sanitizedgamename + gameextension,
                      "type": sanitizeHtml(onlineitems.type)
                    });
                    jsonStr = JSON.stringify(obj, null, "\t");
                    const gameListDir = configDir + "/games.json";
                    fs.writeFile(gameListDir, jsonStr, (err) => { if (err) { console.log(err); } });
                    loadCollection()
                  },
                );
              };
            }
          }
        };

        //show game if it contains the searched query
        let searchgame = sanitizedgamename.toLowerCase()
        let searchsum = sanitizedgameinfo.toLowerCase()
        if (searchgame.includes(search.toLowerCase()) || searchsum.includes(search.toLowerCase())) {
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
    let clickSound = new Audio("assets/click_002.ogg")
    clickSound.volume = 0.1;
    clickSound.play()

    loadMarket(items.JSONDir, items.name, document.getElementById('playbutton').value);
  };
  providerList.appendChild(btn);
});

//Load default game provider
loadMarket("https://bobuxstation.github.io/Coal-Web/games.json", "Coal Games", document.getElementById('playbutton').value);