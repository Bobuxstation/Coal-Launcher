//load dependencies
const Downloader = require("nodejs-file-downloader");

async function downloadgame(game) {
  //Check the type of the game
  if (game.type == "html5" || game.type === "undefined") {
    gameextension = ".html"
  } else if (game.type == "executable") {
    gameextension = ".exe"
  } else if (game.type == "flash") {
    gameextension = ".swf"
  }

  if (!document.getElementById('downloadprogress').innerHTML.includes(sanitizeHtml(game.name))) {
    let downloadprogress = document.createElement("p");
    downloadprogress.innerHTML = "<h2>" + sanitizeHtml(game.name) + "</h2>" + "<p>Please wait...</p>";
    downloadprogress.id = sanitizeHtml(game.name)
    downloadprogress.className = "downloadinfo"
    document.getElementById('downloadprogress').appendChild(downloadprogress);
  }

  document.getElementById("downloads").style.display = "block";

  const downloader = new Downloader({
    url: game.download,
    directory: configDir + "/games",
    fileName: sanitizeHtml(game.name) + gameextension,
    cloneFiles: false,
    maxAttempts: 3,
    onError: function (error) {
      console.log("Error from attempt ", error);
      document.getElementById(sanitizeHtml(game.name)).innerHTML = "<h2>" + sanitizeHtml(game.name) + "</h2>" + "<p>" + error + "</p>";
    },
    onProgress: function (percentage, chunk, remainingSize) {
      let downloadprogres = (Math.round(percentage) + "%. " + remainingSize + " Bytes Left");
      console.log(downloadprogres);
      document.getElementById(sanitizeHtml(game.name)).innerHTML = "<h2>" + sanitizeHtml(game.name) + "</h2>" + "<p>" + downloadprogres + "</p>" + "<progress class='progress' value='" + Math.round(percentage) + "' max='100'></progress>";
    },
  });
  await downloader.download();
};

//download game function
function addedcollection(gameName) {
  if (document.getElementById('downloadprogress').innerHTML.includes(gameName)) { } else {
    let downloadprogress = document.createElement("p");
    downloadprogress.innerHTML = "<h2>" + gameName + "</h2>" + "<p>Game added to collection!</p>";
    downloadprogress.id = gameName
    downloadprogress.className = "downloadinfo"
    document.getElementById('downloadprogress').appendChild(downloadprogress);
  }

  document.getElementById("downloads").style.display = "block";
};

//downloads menu
function downloadsmenu() {
  var x = document.getElementById("downloads");
  if (x.style.display === "none") {
    x.style.display = "block";
    document.getElementById("taskmgr").style.display = "none";
  } else {
    x.style.display = "none";
  }
}