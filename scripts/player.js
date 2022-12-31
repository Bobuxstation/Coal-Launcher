//load dependencies
const urlArgs = new URLSearchParams(window.location.search);
const game = urlArgs.get("game")
const banner = urlArgs.get("banner")
const gamename = urlArgs.get("name")

//Game title and background
document.getElementById('player').src = game;
document.getElementById('titlename').innerText = gamename + " On Coal";
document.getElementById('titlename1').innerText = gamename;
document.getElementById('body').style.backgroundImage = "url('" + banner + "')";

//refreshgame
function refresh() {
    document.getElementById('player').src = game;
}