//load dependencies
const urlArgs = new URLSearchParams(window.location.search);
const game = urlArgs.get("game")
const banner = urlArgs.get("banner")
const gamename = urlArgs.get("name")
const currenttheme = urlArgs.get("theme")
const configDir = urlArgs.get("configDir")
var initialLength

document.getElementById("customthemelink").href = currenttheme || "css/dark.css";

//webview
const webview = document.getElementById('player') || false;
if (webview) {
    webview.src = game
    webview.addEventListener('did-finish-load', function () {
        document.getElementById('refreshbtn').className = 'fa-solid fa-arrow-rotate-right'
        document.getElementById('refreshbtn').style.pointerEvents = "auto"
        document.getElementById('refreshbtn').classList.remove("fa-spin");
    });
}

//flash
if (window.RufflePlayer) {
    window.addEventListener("load", (event) => {
        const ruffle = window.RufflePlayer.newest();
        const player = ruffle.createPlayer();
        const container = document.getElementById("main-body");
        container.appendChild(player);
        player.style = "transition: none;height: 92.5vh; width: 100vw; border: none; box-sizing: border-box;"
        player.load(game);
    });
}

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

setInterval(async () => {
    const fetchedachievements = await fetch(configDir + "/achievements.json")
    const data = await fetchedachievements.json()

    if (!initialLength) { initialLength = data.items.length }
    if (data.items.length > initialLength) {
        initialLength = data.items.length

        var added = data.items[data.items.length - 1]
        document.getElementById("achievementTitle").innerText = added.title
        document.getElementById("achievementbanner").style.display = "block"

        let clickSound = new Audio("assets/click_002.ogg")
        clickSound.volume = 0.1;
        clickSound.play()

        setTimeout(() => {
            document.getElementById("achievementbanner").style.display = "none"
        }, 2500);
    }
}, 500);