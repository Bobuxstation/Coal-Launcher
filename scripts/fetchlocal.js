//load dependencies
let gameList = document.getElementById("mygames");
const electron = require('electron');
console.log(configDir);
let jsonData = require(configDir + '/games.json');

function launchELSE(dir, banner, name) {
    document.getElementById('gameplay').onclick = function () {
        document.getElementById("taskmgr").style.display = "block";

        let taskname = document.createElement("p");
        taskname.innerHTML = "<h2>" + name + "</h2><p>Select a way to open this game</p>";
        taskname.id = name;

        let execoptionbtn = document.createElement("button");
        execoptionbtn.id = "endtask";
        execoptionbtn.innerHTML = "Launch as an executable";
        execoptionbtn.onclick = function () {
            var proc = require('child_process').spawn(dir);
            taskname.remove();
    
            let newtaskname = document.createElement("p");
            newtaskname.innerHTML = "<h2>" + name + "</h2>" + "<button id='endtask'>Click To End Session</button>";
            newtaskname.id = name
            newtaskname.onclick = function () {
                proc.kill('SIGINT');
            }
            newtaskname.className = "downloadinfo"
            document.getElementById('tasks').appendChild(newtaskname);
    
            proc.on('exit', function (code, signal) {
                newtaskname.remove()
            });
        }
        taskname.appendChild(execoptionbtn);

        let execoptionbtn1 = document.createElement("button");
        execoptionbtn1.id = "endtask";
        execoptionbtn1.innerHTML = "Launch as a web game";
        execoptionbtn1.onclick = function () {
            window.open(
                "player.html?game=" + dir + "&banner=" + banner + "&name=" + name,
                '_blank',
                'icon= "./assets/logo.png",nodeIntegration=yes,webviewTag=true, autoHideMenuBar= true, width= 1000, height= 600,'
            );
            taskname.remove()
        }
        taskname.appendChild(execoptionbtn1);

        taskname.className = "downloadinfo notifytask";
        document.getElementById('tasks').appendChild(taskname);
    };
}

//function to launch html5 games
function launchHTML(dir, banner, name) {
    document.getElementById('gameplay').onclick = function () {
        window.open(
            "player.html?game=" + dir + "&banner=" + banner + "&name=" + name,
            '_blank',
            'icon= "./assets/logo.png",webviewTag=true, autoHideMenuBar= true, width= 1000, height= 600,nodeIntegration=yes'
        );
    };
}

//function to launch flash games
function launchSWF(dir, banner, name) {
    document.getElementById('gameplay').onclick = function () {
        window.open(
            "flashplayer.html?game=" + dir + "&banner=" + banner + "&name=" + name,
            '_blank',
            'icon= "./assets/logo.png",nodeIntegration=yes,webviewTag=true, autoHideMenuBar= true, width= 1000, height= 600,'
        );
    };
}

//function to launch executable games
function launchEXEC(dir, name) {
    document.getElementById('gameplay').onclick = function () {
        document.getElementById("taskmgr").style.display = "block"
        var proc = require('child_process').spawn(dir);

        let taskname = document.createElement("p");
        taskname.innerHTML = "<h2>" + name + "</h2>" + "<button id='endtask'>Click To End Session</button>";
        taskname.id = name
        taskname.onclick = function () {
            proc.kill('SIGINT');
        }
        taskname.className = "downloadinfo"
        document.getElementById('tasks').appendChild(taskname);

        proc.on('exit', function (code, signal) {
            taskname.remove()
        });
    };
}

jsonData.items.forEach(items => {
    let btn = document.createElement("button");
    btn.textContent = items.name;
    let banner = items.banner;
    btn.onclick = function () {
        document.getElementById('gamename').textContent = items.name;
        document.getElementById('gamedev').textContent = items.developer;
        if (typeof items.type === "undefined" || items.type == "html5") {
            launchHTML(items.dir, items.banner, items.name)
        } else if (items.type == "executable") {
            launchEXEC(items.dir, items.name)
        } else if (items.type == "flash") {
            launchSWF(items.dir, items.banner, items.name)
        } else {
            launchELSE(items.dir, items.banner, items.name)
        }
        document.getElementById('gamedetails').style.display = "block";
        document.getElementById('body').style.backgroundImage = "url('" + items.banner + "')";
        if (items.feed == "false" || items.feed == false) {
            document.getElementById('gamefeed').style.display = "none";
        } else {
            document.getElementById('gamefeed').src = items.feed;
            document.getElementById('gamefeed').style.display = "block";
        }
    };

    document.getElementById('gamename').textContent = items.name;
    document.getElementById('gamedev').textContent = items.developer;
    if (typeof items.type === "undefined" || items.type == "html5") {
        launchHTML(items.dir, items.banner, items.name)
    } else if (items.type == "executable") {
        launchEXEC(items.dir, items.name)
    } else if (items.type == "flash") {
        launchSWF(items.dir, items.banner, items.name)
    } else {
        launchELSE(items.dir, items.banner, items.name)
    }
    document.getElementById('gamedetails').style.display = "block";
    document.getElementById('body').style.backgroundImage = "url('" + items.banner + "')";
    if (items.feed == "false" || items.feed == false) {
        document.getElementById('gamefeed').style.display = "none";
    } else {
        document.getElementById('gamefeed').src = items.feed;
        document.getElementById('gamefeed').style.display = "block";
    }

    gameList.appendChild(btn);
});

//downloads menu
function taskmgr() {
    var x = document.getElementById("taskmgr");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}