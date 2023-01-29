//load dependencies
const urlArgs = new URLSearchParams(window.location.search);
const game = urlArgs.get("game")
const banner = urlArgs.get("banner")
const gamename = urlArgs.get("name")


//webview
const webview = document.getElementById('player');
webview.addEventListener('did-finish-load', function () {
    document.getElementById('refreshbtn').innerHTML = '<i class="fa-solid fa-arrow-rotate-right"></i>'
    document.getElementById('refreshbtn').style.pointerEvents = "auto"
    document.getElementById('refreshbtn').className = ""
});

//Game title and background
document.getElementById('player').src = game;
document.getElementById('titlename').innerText = gamename + " On Coal";
document.getElementById('titlename1').innerText = gamename;
document.getElementById('body').style.backgroundImage = "url('" + banner + "')";

//refreshgame
function refresh() {
    console.log(webview.tagName)
    if (webview.tagName == "EMBED") {
        webview.src = game
    } else if (webview.tagName == "WEBVIEW") {
        webview.reload();
        document.getElementById('refreshbtn').innerHTML = '<i class="fa-solid fa-spinner"></i>'
        document.getElementById('refreshbtn').style.pointerEvents = "none"
        document.getElementById('refreshbtn').className = "rotating"
    }
}

function screenshot() {
    contents.capturePage()
}

//downloads menu
function speedruncounter() {
    var x = document.getElementById("speedruncounter");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

var span = document.getElementById('clock');

function time() {
    var d = new Date();
    var s = d.getSeconds();
    var m = d.getMinutes();
    var h = d.getHours();
    span.textContent =
        (" ") + ("0" + h).substr(-2) + "  :  " + ("0" + m).substr(-2);
};

setInterval(time)