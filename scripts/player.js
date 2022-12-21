const urlArgs = new URLSearchParams(window.location.search);
const game = urlArgs.get("game")
const banner = urlArgs.get("banner")
const gamename = urlArgs.get("name")

document.getElementById('player').src = game;
document.getElementById('titlename').innerHTML = gamename + " On Coal";
document.getElementById('titlename1').innerHTML = gamename;
document.getElementById('body').style.backgroundImage = "url('" + banner + "')";

function refresh() {
    document.getElementById('player').src = game;
}