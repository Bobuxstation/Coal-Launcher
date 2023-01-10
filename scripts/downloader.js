//load dependencies
const Downloader = require("nodejs-file-downloader");

//download game function
function downloadgame(gameURL, gameName, gametype) {
    if (document.getElementById('downloadprogress').innerHTML.includes(gameName)){
    } else {
    let downloadprogress = document.createElement("p");
    downloadprogress.innerHTML = "<h2>" + gameName + "</h2>" + "<p>Please wait...</p>";
    downloadprogress.id = gameName
    downloadprogress.className = "downloadinfo"
    document.getElementById('downloadprogress').appendChild(downloadprogress);
    }

    document.getElementById("downloads").style.display = "block";

    const downloader = new Downloader({
        url: gameURL,
        directory: configDir + "/games",
        fileName: gameName + gametype,
        cloneFiles: false,
        maxAttempts: 3,
        onError: function (error) {
          console.log("Error from attempt ", error);
          document.getElementById(gameName).innerHTML = "<h2>" + gameName + "</h2>" + "<p>" + error + "</p>";
        },
        onProgress: function (percentage, chunk, remainingSize) {
            let downloadprogres = (Math.round(percentage) + "%. " + remainingSize + " Bytes Left");
            console.log(downloadprogres);
            document.getElementById(gameName).innerHTML = "<h2>" + gameName + "</h2>" + "<p>" + downloadprogres + "</p>" + "<progress class='progress' value='" + Math.round(percentage) + "' max='100'></progress>";
          },
      });
    downloader.download();
    };

//downloads menu
function downloadsmenu() {
  var x = document.getElementById("downloads");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}