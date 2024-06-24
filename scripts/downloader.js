//load dependencies
const Downloader = require("nodejs-file-downloader");

//another code stolen from stackoverflow
function formatSizeUnits(bytes) {
  if (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
  else if (bytes >= 1048576) { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
  else if (bytes >= 1024) { bytes = (bytes / 1024).toFixed(2) + " KB"; }
  else if (bytes > 1) { bytes = bytes + " bytes"; }
  else if (bytes == 1) { bytes = bytes + " byte"; }
  else { bytes = "0 bytes"; }
  return bytes;
}

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
    downloadprogress.innerHTML = "<h3>" + sanitizeHtml(game.name) + "</h3>" + "<p>Please wait...</p>";
    downloadprogress.id = sanitizeHtml(game.name)
    downloadprogress.className = "downloadinfo"
    document.getElementById('downloadprogress').appendChild(downloadprogress);
  }

  document.getElementById('marketbtn').click();
  document.getElementById("downloads").style.display = "block";
  document.getElementById("downloadsNavBtn").ariaSelected = "true";

  const downloader = new Downloader({
    url: game.download,
    directory: configDir + "/games",
    fileName: sanitizeHtml(game.name) + gameextension,
    cloneFiles: false,
    maxAttempts: 3,
    onError: function (error) {
      console.log("Error from attempt ", error);
      document.getElementById(sanitizeHtml(game.name)).innerHTML = "<h3>" + sanitizeHtml(game.name) + "</h3>" + "<p>" + error + "</p>";
    },
    onProgress: function (percentage, chunk, remainingSize) {
      let downloadprogres = (Math.round(percentage) + "%. " + formatSizeUnits(remainingSize) + " Left");
      console.log(downloadprogres);
      document.getElementById(sanitizeHtml(game.name)).innerHTML = "<h3>" + sanitizeHtml(game.name) + "</h3>" + "<p>" + downloadprogres + "</p>" + "<progress class='progress' value='" + Math.round(percentage) + "' max='100'></progress>";
    },
  });
  await downloader.download();
};

async function downloadFileToThemeFolder(game) {
  const downloader = new Downloader({
    url: game.link,
    directory: configDir + "/themes",
    fileName: sanitizeHtml(game.name) + ".css",
    cloneFiles: false,
    maxAttempts: 3,
  });

  await downloader.download();
};

//download game function
function addedcollection(gameName) {
  if (document.getElementById('downloadprogress').innerHTML.includes(gameName)) { } else {
    let downloadprogress = document.createElement("p");
    downloadprogress.innerHTML = "<h3>" + gameName + "</h3>" + "<p>Game added to collection!</p>";
    downloadprogress.id = gameName
    downloadprogress.className = "downloadinfo"
    document.getElementById('downloadprogress').appendChild(downloadprogress);
  }

  document.getElementById('marketbtn').click();
  document.getElementById("downloads").style.display = "block";
  document.getElementById("downloadsNavBtn").ariaSelected = "true";
};

function extensionadded(gameName) {
  if (document.getElementById('downloadprogress').innerHTML.includes(gameName)) { } else {
    let downloadprogress = document.createElement("p");
    downloadprogress.innerHTML = "<h3>" + gameName + "</h3>" + "<p>Theme/Extension/Repository has been saved! Restart launcher to see changes.</p>";
    downloadprogress.id = gameName
    downloadprogress.className = "downloadinfo"
    document.getElementById('downloadprogress').appendChild(downloadprogress);
  }

  document.getElementById('marketbtn').click();
  document.getElementById("downloads").style.display = "block";
  document.getElementById("downloadsNavBtn").ariaSelected = "true";
};

//downloads menu
function downloadsmenu() {
  var x = document.getElementById("downloads");
  if (x.style.display === "none") {
    x.style.display = "block";
    document.getElementById("downloadsNavBtn").ariaSelected = "true";
  } else {
    x.style.display = "none";
    document.getElementById("downloadsNavBtn").ariaSelected = "false";
  }
}