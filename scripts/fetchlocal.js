//load dependencies
let gameList = document.getElementById("mygames");
const { exec } = require('child_process');
const electron = require('electron');
const sudo = require('sudo-prompt');
console.log(configDir);
let jsonData = require(configDir + '/games.json');
var lastGameBackground;

//launch game with admin or sudo
function elevateGame(name, dir, taskname) {
    let execoptionbtn = document.createElement("button");
    execoptionbtn.innerText = "Elevate access"
    execoptionbtn.id = "endtask"
    execoptionbtn.onclick = function () {
        var options = { name: name };
        sudo.exec(dir, options, function (error, stdout, stderr) { taskname.remove() });
    }
    taskname.appendChild(execoptionbtn)
}

//launch game that is not supported
function launchELSE(dir, banner, name) {
    document.getElementById("execonly").style.display = "block";
    document.getElementById('gameplay').onclick = function () {
        let clickSound = new Audio("assets/open_003.ogg")
        clickSound.play()

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

            proc.on('error', err => {
                if (err.code === 'EACCES') {
                    newtaskname.innerHTML = "<h2>" + name + "</h2>" + ('This game may require elevated privileges to run.');
                    elevateGame(name, dir, newtaskname);
                } else {
                    newtaskname.innerHTML = "<h2>" + name + "</h2>" + (`An error occurred: ${err.message}`);
                }
            });

            let newtaskname = document.createElement("p");
            newtaskname.innerHTML = "<h2>" + name + "</h2>" + "<button id='endtask'>Click To End Session</button>";
            newtaskname.id = name
            newtaskname.onclick = function () {
                proc.kill('SIGINT');
                newtaskname.remove()
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
    document.getElementById("execonly").style.display = "none";
    document.getElementById('gameplay').onclick = function () {
        let clickSound = new Audio("assets/open_003.ogg")
        clickSound.play()

        window.open(
            "player.html?game=" + dir + "&banner=" + banner + "&name=" + name,
            '_blank',
            'icon= "./assets/logo.png",webviewTag=true, autoHideMenuBar= true, width= 1000, height= 600,nodeIntegration=yes'
        );
    };
}

//function to launch flash games
function launchSWF(dir, banner, name) {
    document.getElementById("execonly").style.display = "none";
    document.getElementById('gameplay').onclick = function () {
        let clickSound = new Audio("assets/open_003.ogg")
        clickSound.play()

        window.open(
            "flashplayer.html?game=" + dir + "&banner=" + banner + "&name=" + name,
            '_blank',
            'icon= "./assets/logo.png",nodeIntegration=yes,webviewTag=true, autoHideMenuBar= true, width= 1000, height= 600,'
        );
    };
}

//function to launch executable games
function launchEXEC(dir, name) {
    document.getElementById("execonly").style.display = "block";
    document.getElementById('gameplay').onclick = function () {
        let clickSound = new Audio("assets/open_003.ogg")
        clickSound.play()

        document.getElementById("taskmgr").style.display = "block"
        var proc = require('child_process').spawn(dir);

        proc.on('error', err => {
            if (err.code === 'EACCES') {
                taskname.innerHTML = "<h2>" + name + "</h2>" + ('This game may require elevated privileges to run.');
                elevateGame(name, dir, taskname)
            } else {
                taskname.innerHTML = "<h2>" + name + "</h2>" + (`An error occurred: ${err.message}`);
            }
        });

        let taskname = document.createElement("p");
        taskname.innerHTML = "<h2>" + name + "</h2>" + "<button id='endtask'>Click To End Session</button>";
        taskname.id = name
        taskname.onclick = function () {
            proc.kill('SIGINT');
            taskname.remove()
        }
        taskname.className = "downloadinfo"
        document.getElementById('tasks').appendChild(taskname);

        proc.on('exit', function (code, signal) {
            taskname.remove()
        });
    };
}

function loadCollection() {
    gameList.innerHTML = `
    <a  onclick="document.getElementById('optionbtn').click()">
        <button>
            <i class="fa-solid fa-plus"></i> Add a game
        </button>
    </a>
    <a  onclick="document.getElementById('marketbtn').click()">
        <button>
            <i class="fa-solid fa-download"></i> Download a game
        </button>
    </a>
    <hr>
    `

    if (jsonData.items.length != 0) {
        jsonData.items.forEach(function (items, index) {
            let btn = document.createElement("button");
            btn.textContent = items.name;
            let banner = items.banner;
            btn.onclick = function () {
                let clickSound = new Audio("assets/click_002.ogg")
                clickSound.play()

                if (typeof items.type === "undefined" || items.type == "html5") {
                    gameextensionicon = '<i class="fa-brands fa-html5"></i> '
                } else if (items.type == "executable") {
                    gameextensionicon = '<i class="fa-brands fa-windows"></i> '
                } else if (items.type == "flash") {
                    gameextensionicon = '<i class="fa-solid fa-bolt"></i> '
                } else {
                    gameextensionicon = ''
                }

                document.getElementById('gamename').innerHTML = gameextensionicon + items.name;
                document.getElementById('gamedev').textContent = items.developer;
                document.getElementById('deletegame').onclick = function () {
                    removeItem(index, items);
                    toggleContext()
                }
                document.getElementById('createDesktopShortcut').onclick = function () {
                    createShortcut(items.dir)
                    toggleContext()
                }
                document.getElementById('showinfolder').onclick = function () {
                    shell.showItemInFolder(configDir + "/games")
                    toggleContext()
                }
                document.getElementById('emulatePrompt').onclick = function () {
                    const preferredEmulator = jsonData.preferredEmulator || "wine"
                    const dir = items.dir
                    const name = items.name

                    document.getElementById("taskmgr").style.display = "block"
                    var proc = require('child_process').exec(preferredEmulator + " " + dir);
                    proc.on('error', err => {
                        if (err.code === 'EACCES') {
                            taskname.innerHTML = "<h2>" + name + "</h2>" + ('This game may require elevated privileges to run.');
                            elevateGame(name, dir, taskname)
                        } else {
                            taskname.innerHTML = "<h2>" + name + "</h2>" + (`An error occurred: ${err.message}`);
                        }
                    });
                    let taskname = document.createElement("p");
                    taskname.innerHTML = "<h2>" + name + "</h2>" + "<button id='endtask'>Click To End Session</button>";
                    taskname.id = name
                    taskname.onclick = function () {
                        proc.kill('SIGINT');
                        taskname.remove()
                    }
                    taskname.className = "downloadinfo"
                    document.getElementById('tasks').appendChild(taskname);
                    proc.on('exit', function (code, signal) {
                        taskname.remove()
                    });
                    toggleContext()
                }
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
                lastGameBackground = items.banner;
                if (items.feed == "false" || items.feed == false) {
                    document.getElementById('gamefeed').style.display = "none";
                } else {
                    document.getElementById('gamefeed').src = items.feed;
                    document.getElementById('gamefeed').style.display = "block";
                }
            };

            btn.click()

            gameList.appendChild(btn);
        });
    } else {
        document.getElementById('gamefeed').style.display = "none";
        document.getElementById('gamedetails').style.display = "none";
        document.getElementById('body').style.backgroundImage = "";
        lastGameBackground = "";
    }
}

//downloads menu
function taskmgr() {
    var x = document.getElementById("taskmgr");
    if (x.style.display === "none") {
        x.style.display = "block";
        document.getElementById("downloads").style.display = "none";
    } else {
        x.style.display = "none";
    }
}

//context menu
function toggleContext() {
    var x = document.getElementById("gameextra");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

//to remove games
function removeItem(index, items) {
    document.getElementById("taskmgr").style.display = "block"

    let taskname = document.createElement("p");
    taskname.innerHTML = "<h2>" + items.name + "</h2>" + "Are you sure you want to remove this game from your collection?";
    taskname.id = name
    taskname.className = "downloadinfo"
    document.getElementById('tasks').appendChild(taskname);

    let deleteYes = document.createElement("button");
    deleteYes.id = "endtask";
    deleteYes.innerHTML = "Yes";
    deleteYes.onclick = function () {
        jsonData.items.splice(index, 1);
        loadCollection()

        jsonStr = JSON.stringify(jsonData, null, "\t");
        console.log(jsonStr);
        fs.writeFile(configDir + '/games.json', jsonStr, (err) => {
            if (err) {
                console.log(err);
            }
        });

        taskname.remove()
    }
    taskname.appendChild(deleteYes)

    let deleteNo = document.createElement("button");
    deleteNo.id = "endtask";
    deleteNo.innerHTML = "No";
    deleteNo.onclick = function () {
        taskname.remove()
    }
    taskname.appendChild(deleteNo)
}

loadCollection()