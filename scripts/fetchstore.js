let discoverList = document.getElementById("notmygames");
let jsonData = require(configDir + '/games.json');
let gameList = document.getElementById("mygames");
let gameProviderList = require(configDir + '/gameProviders.json');

function loadMarket(jsonURL, jsonName) {
  discoverList.innerHTML = '<h2 style="padding-left: 10px;" id="markettitle"></h2>';
  document.getElementById('markettitle').innerText = jsonName;
  fetch(jsonURL, {cache: "no-store"})
          .then((res) => {return res.json();})
          .then((data) => 
            data.items.forEach(onlineitems => {
            let btn = document.createElement("div");
            btn.innerHTML = "<H4>" + onlineitems.name +"</H4>" + onlineitems.developer + "<BR>" + "<BR><p>" + onlineitems.info + "</p>";
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
          })) 
          .catch(error => {discoverList.innerHTML = '<h4 style="text-align: center;">Cannot load market at the moment, Check your internet connection.</h4><p style="text-align: center;">' + error.message + '</p>';});
};

gameProviderList.items.forEach(items => {
  let btn = document.createElement("button");
  btn.textContent = items.name;
  btn.onclick = function () {
    loadMarket(items.JSONDir, items.name);
  };
  gameList.appendChild(btn);
});

loadMarket("https://bobuxstation.github.io/Coal-Web/games.json", "Coal Games");