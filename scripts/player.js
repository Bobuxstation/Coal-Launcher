//load dependencies
const urlArgs = new URLSearchParams(window.location.search);
const game = urlArgs.get("game")
const banner = urlArgs.get("banner")
const gamename = urlArgs.get("name")


//webview
const webview = document.getElementById('player');
webview.addEventListener('did-finish-load', function () {
    document.getElementById('refreshbtn').className = 'fa-solid fa-arrow-rotate-right'
    document.getElementById('refreshbtn').style.pointerEvents = "auto"
    document.getElementById('refreshbtn').classList.remove("fa-spin");
});

function fullscreen(element) {
    document.getElementsByClassName('fullscreenbtn')[0].style.display = "none"
    document.getElementsByClassName('exitfullscreenbtn')[0].style.display = "block"
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitfullscreen() {
    document.getElementsByClassName('exitfullscreenbtn')[0].style.display = "none"
    document.getElementsByClassName('fullscreenbtn')[0].style.display = "block"
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

//Game title and background
document.getElementById('player').src = game;
document.getElementById('titlename').innerText = gamename + " On Coal";
document.getElementById('titlename1').innerText = gamename;
document.getElementById('body').style.backgroundImage = "url('" + banner + "')";

//refreshgame
function refresh() {
    console.log(webview.tagName)
    if (webview.tagName == "EMBED") {
        webview.src = game;
    } else if (webview.tagName == "WEBVIEW") {
        webview.reload();
        document.getElementById('refreshbtn').className = 'fa-solid fa-spinner'
        document.getElementById('refreshbtn').style.pointerEvents = "none"
        document.getElementById('refreshbtn').classList.add("fa-spin");
    }
}

//downloads menu
function speedruncounter() {
    var x = document.getElementById("speedruncounter");
    if (x.style.display === "none") {
        x.style.display = "block";
        document.getElementById("gamemgr").style.display = "none"
    } else {
        x.style.display = "none";
    }
}

function sidebarmenu() {
    var x = document.getElementById("gamemgr");
    if (x.style.display === "none") {
        x.style.display = "block";
        document.getElementById("speedruncounter").style.display = "none"
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