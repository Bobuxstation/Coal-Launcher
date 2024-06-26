//load dependencies
let discoverList = document.getElementById("notmygames");
let providerList = document.getElementById("myproviders");
let gameProviderList = require(configDir + '/gameProviders.json');
let achievementsList = require(configDir + '/achievements.json');
const sanitizeHtml = require('sanitize-html');
let lastDownloadsBackground

//game feed resizing function
addEventListener("resize", (event) => {
  document.getElementById('previewgamefeed').style.height = "calc(100vh - " + "209.5px - " + document.getElementById('downloaddetails').offsetHeight + "px)";
});

//function for fetching market
function loadMarket(jsonURL, jsonName, search) {
  //change title to the game provider name
  discoverList.innerHTML = '';
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
        let cutgameinfo = ``

        //cut game description if too long
        if (sanitizedgameinfo.length > 128) {
          cutgameinfo = sanitizedgameinfo.slice(0, 128) + '...';
        } else {
          cutgameinfo = sanitizedgameinfo
        }

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
        } else if (onlineitems.type == "repository") {
          gameextensionicon = '<i class="fa-solid fa-folder"></i> '
        }

        //set game extension
        if (onlineitems.type == "html5" || onlineitems.type === "undefined") {
          gameextension = ".html"
        } else if (onlineitems.type == "executable") {
          gameextension = ".exe"
        } else if (onlineitems.type == "flash") {
          gameextension = ".swf"
        }

        //game card layout
        btn.innerHTML =
          "</div>" + "<div class='gamecard'>" +
          "<h3>" + gameextensionicon + sanitizedgamename + "</h3>" +
          `<p>${sanitizeddevname}</p>` +
          `<br><p title="${sanitizedgameinfo}">` + cutgameinfo + "</p></div>";
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

          if (onlineitems.feed == "false" || onlineitems.feed == false || !onlineitems.feed) {
            document.getElementById('previewgamefeed').style.display = "none";
          } else {
            document.getElementById('previewgamefeed').src = onlineitems.feed;
            document.getElementById('previewgamefeed').style.display = "block";
            document.getElementById('previewgamefeed').style.height = "calc(100vh - " + "209.5px - " + document.getElementById('downloaddetails').offsetHeight + "px)";
          }

          document.getElementById('downloadgamebutton').onclick = function () {
            let clickSound = new Audio("assets/toggle_002.ogg")
            clickSound.volume = 0.1;
            clickSound.play()

            switch (onlineitems.type) {
              case "link":
                // Adds game to the collection without downloading if it is a link
                let linkItemToAppend = {
                  "name": sanitizedgamename,
                  "feed": sanitizeHtml(onlineitems.feed),
                  "Version": sanitizeHtml(onlineitems.Version),
                  "developer": sanitizeddevname,
                  "banner": sanitizeHtml(onlineitems.banner),
                  "dir": onlineitems.download,
                  "type": "html5"
                };

                if (jsonData.items.some(item => JSON.stringify(item) === JSON.stringify(linkItemToAppend))) {
                  addedcollection(sanitizedgamename);
                } else {
                  var obj = jsonData;
                  obj['items'].push(linkItemToAppend);
                  jsonStr = JSON.stringify(obj, null, "\t");
                  const gameListDir = configDir + "/games.json";
                  fs.writeFile(gameListDir, jsonStr, (err) => { if (err) { console.log(err); } });

                  addedcollection(sanitizedgamename);
                  loadCollection();
                }
                break;

              case "repository":
                // Installs the game as a repository if it is a repository
                let repoItemToAppend = {
                  "name": sanitizedgamename,
                  "JSONDir": onlineitems.link,
                };

                if (gameProviderList.items.some(item => JSON.stringify(item) === JSON.stringify(repoItemToAppend))) {
                  extensionadded(sanitizedgamename);
                  loadRepositories()
                } else {
                  var obj = gameProviderList;
                  obj['items'].push(repoItemToAppend);
                  jsonStr = JSON.stringify(obj, null, "\t");
                  const gameListDir = configDir + "/gameProviders.json";
                  fs.writeFile(gameListDir, jsonStr, (err) => { if (err) { console.log(err); } });

                  extensionadded(sanitizedgamename);
                  loadRepositories()
                }
                break;

              case "extension":
                // Installs the game as an extension if it is an extension
                let extensionItemToAppend = {
                  "name": sanitizedgamename,
                  "icon": onlineitems.icon,
                  "URL": onlineitems.link,
                };

                if (tabList.extensions.some(item => JSON.stringify(item) === JSON.stringify(extensionItemToAppend))) {
                  extensionadded(sanitizedgamename);
                } else {
                  var obj = tabList;
                  obj['extensions'].push(extensionItemToAppend);
                  jsonStr = JSON.stringify(obj, null, "\t");
                  const gameListDir = configDir + "/extensions.json";
                  fs.writeFile(gameListDir, jsonStr, (err) => { if (err) { console.log(err); } });

                  extensionadded(sanitizedgamename);
                }
                break;

              case "theme":
                // Only download it to the themes folder if it's a theme
                downloadFileToThemeFolder(onlineitems).then(function () {
                  extensionadded(sanitizedgamename);
                });
                break;

              default:
                // Check if game exists
                let defaultItemToAppend = {
                  "name": sanitizedgamename,
                  "feed": sanitizeHtml(onlineitems.feed),
                  "Version": sanitizeHtml(onlineitems.Version),
                  "developer": sanitizeddevname,
                  "banner": sanitizeHtml(onlineitems.banner),
                  "dir": configDir + "/games/" + sanitizedgamename + gameextension,
                  "type": sanitizeHtml(onlineitems.type)
                };

                if (jsonData.items.some(item => JSON.stringify(item) === JSON.stringify(defaultItemToAppend))) {
                  console.log('game exists! updating html file...');
                  downloadgame(onlineitems);
                } else {
                  downloadgame(onlineitems).then(function (value) {
                    var obj = jsonData;
                    obj['items'].push(defaultItemToAppend);
                    jsonStr = JSON.stringify(obj, null, "\t");
                    const gameListDir = configDir + "/games.json";
                    fs.writeFile(gameListDir, jsonStr, (err) => { if (err) { console.log(err); } });

                    loadCollection();
                  });
                }
                break;
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
function loadRepositories(first) {
  providerList.innerHTML = `
    <a onclick="document.getElementById('optionbtn').click()" href="#addgametitle"><button><i
          class="fa-solid fa-plus"></i> Add a game</button></a>
    <a onclick="document.getElementById('optionbtn').click()" href="#launcherconfigtitle"><button><i
          class="fa-solid fa-folder-plus"></i> Add a repository</button></a>
    <hr>
    <a onclick="loadRepositories()"><button><i class="fa-solid fa-arrows-rotate"></i> Refresh repositories</button></a>
  `
  gameProviderList.items.forEach((items, i) => {
    let btn = document.createElement("button");
    btn.textContent = items.name;
    btn.onclick = function () {
      let clickSound = new Audio("assets/click_002.ogg")
      clickSound.volume = 0.1;
      clickSound.play();

      document.getElementById('playbutton').value = "";

      loadMarket(items.JSONDir, items.name, document.getElementById('playbutton').value);
    };
    providerList.appendChild(btn);

    if (i == 0 && first) btn.click();
  });
}
loadRepositories(true)

function loadAchievements(search) {
  document.getElementById("myachievements").innerHTML = ""

  if (achievementsList.items.length == 0) {
    document.getElementById("myachievements").innerHTML = '<br><h4 style="text-align: center;">You have no achievements!</h4>'
  }

  achievementsList.items.forEach(function (onlineitems) {
    //Sanitize game details
    let sanitizedgamename = sanitizeHtml(onlineitems.title);
    let sanitizeddevname = sanitizeHtml(onlineitems.game);
    let sanitizedgameinfo = sanitizeHtml(onlineitems.desc);

    //make the element
    let btn = document.createElement("div");
    btn.innerHTML =
      "</div>" + "<div class='gamecard'>" +
      `<h3><i class="fa-solid fa-award"></i> ` + sanitizedgamename + "</h3>" +
      `<p>From ${sanitizeddevname}</p>` +
      `<br><p title="${sanitizedgameinfo}">` + sanitizedgameinfo.slice(0, 128) + "...</p></div>";
    btn.className = "STOREGAME";

    let banner = onlineitems.banner;
    btn.style.backgroundImage = "url(" + banner + ")";

    let searchgame = sanitizedgamename.toLowerCase()
    let searchsum = sanitizedgameinfo.toLowerCase()
    let searchdev = sanitizeddevname.toLowerCase()
    if (searchgame.includes(search.toLowerCase()) || searchsum.includes(search.toLowerCase()) || searchdev.includes(search.toLowerCase())) {
      document.getElementById("myachievements").appendChild(btn)
    }
  })
}
loadAchievements("")