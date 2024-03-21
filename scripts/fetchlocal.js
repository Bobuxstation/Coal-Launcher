//load dependencies
let gameList = document.getElementById("mygames");
const { exec } = require('child_process');
const { electron, ipcRenderer } = require('electron');
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
function launchELSE(dir, banner, name, args) {
    document.getElementById("execonly").style.display = "block";
    document.getElementById('gameplay').onclick = function () {
        let clickSound = new Audio("assets/open_003.ogg")
        clickSound.volume = 0.1;
        clickSound.play()

        document.getElementById("taskmgr").style.display = "block";
        document.getElementById("taskNavBtn").ariaSelected = "true";

        let taskname = document.createElement("p");
        taskname.innerHTML = "<h3>" + name + "</h3><p>Select a way to open this game</p><br>";
        taskname.id = name;

        let execoptionbtn = document.createElement("button");
        execoptionbtn.id = "endtask";
        execoptionbtn.innerHTML = "Launch as an executable";
        execoptionbtn.onclick = function () {
            var proc = require('child_process').spawn(dir, [args]);
            taskname.remove();

            proc.on('error', err => {
                if (err.code === 'EACCES') {
                    newtaskname.innerHTML = "<h3>" + name + "</h3>" + ('This game may require elevated privileges to run.<br><br>');
                    elevateGame(name, dir, newtaskname);
                } else {
                    newtaskname.innerHTML = "<h3>" + name + "</h3>" + (`An error occurred: ${err.message}<br><br>`);
                }
            });

            let newtaskname = document.createElement("p");
            newtaskname.innerHTML = "<h3>" + name + "</h3><br>" + "<button id='endtask'>Click To End Session</button>";
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
            HTMLChildWindow(dir, banner, name)
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
        clickSound.volume = 0.1;
        clickSound.play()

        HTMLChildWindow(dir, banner, name)
    };
}
function HTMLChildWindow(dir, banner, name) {
    const newWindow = new remote.BrowserWindow({
        icon: "./assets/logo.png",
        autoHideMenuBar: true,
        width: 1000,
        height: 600,
        webPreferences: {
            webviewTag: true,
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Construct the URL
    const url = new URL(
        path.join(__dirname, "player.html")
    );
    url.searchParams.append('game', dir);
    url.searchParams.append('banner', banner);
    url.searchParams.append('name', name);
    url.searchParams.append('theme', themePath);
    url.searchParams.append('configDir', configDir);

    // Load your HTML file or URL into the new BrowserWindow
    newWindow.loadURL(url.href);
}

//function to launch flash games
function launchSWF(dir, banner, name) {
    document.getElementById("execonly").style.display = "none";
    document.getElementById('gameplay').onclick = function () {
        let clickSound = new Audio("assets/open_003.ogg")
        clickSound.volume = 0.1;
        clickSound.play()

        FlashChildWindow(dir, banner, name)
    };
}
function FlashChildWindow(dir, banner, name) {
    const newWindow = new remote.BrowserWindow({
        icon: "./assets/logo.png",
        autoHideMenuBar: true,
        width: 1000,
        height: 600,
        webPreferences: {
            webviewTag: true,
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Construct the URL
    const url = new URL(
        path.join(__dirname, "flashplayer.html")
    );
    url.searchParams.append('game', dir);
    url.searchParams.append('banner', banner);
    url.searchParams.append('name', name);
    url.searchParams.append('theme', themePath);
    url.searchParams.append('configDir', configDir);

    // Load your HTML file or URL into the new BrowserWindow
    newWindow.loadURL(url.href);
}

//function to launch executable games
function launchEXEC(dir, name, args) {
    document.getElementById("execonly").style.display = "block";
    document.getElementById('gameplay').onclick = function () {
        let clickSound = new Audio("assets/open_003.ogg")
        clickSound.volume = 0.1;
        clickSound.play()

        document.getElementById("taskmgr").style.display = "block"
        document.getElementById("taskNavBtn").ariaSelected = "true";
        var proc = require('child_process').spawn(dir, [args]);

        proc.on('error', err => {
            if (err.code === 'EACCES') {
                taskname.innerHTML = "<h3>" + name + "</h3>" + ('This game may require elevated privileges to run.<br><br>');
                elevateGame(name, dir, taskname)
            } else {
                taskname.innerHTML = "<h3>" + name + "</h3>" + (`An error occurred: ${err.message}<br><br>`);
            }
        });

        let taskname = document.createElement("p");
        taskname.innerHTML = "<h3>" + name + "</h3><br>" + "<button id='endtask'>Click To End Session</button>";
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
    <a onclick="document.getElementById('optionbtn').click()" href="#addgametitle">
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
    <a onclick="loadCollection()"><button><i class="fa-solid fa-arrows-rotate"></i> Refresh collections</button></a>
    `

    jsonData.items = jsonData.items.sort(compare)

    if (jsonData.items.length != 0) {
        jsonData.items.forEach(function (items, index) {
            let btn = document.createElement("button");
            btn.textContent = items.name;
            let banner = items.banner;
            btn.onclick = function () {
                let clickSound = new Audio("assets/click_002.ogg")
                clickSound.volume = 0.1;
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
                document.getElementById('editPrompt').onclick = function () {
                    document.getElementById("taskmgr").style.display = "block"
                    document.getElementById("taskNavBtn").ariaSelected = "true";

                    if (document.getElementById('tasks').innerHTML.includes(sanitizeHtml(items.name))) return;

                    let taskname = document.createElement("p");
                    taskname.innerHTML = "<h3>" + items.name + "</h3>" + "Enter new argument.<br><br>";
                    taskname.id = items.name
                    taskname.className = "downloadinfo"
                    document.getElementById('tasks').appendChild(taskname);

                    let argsInput = document.createElement("input");
                    argsInput.id = "endtask";
                    argsInput.value = items.arguments || "";
                    taskname.appendChild(argsInput);
                    argsInput.focus();

                    let saveArgs = document.createElement("button");
                    saveArgs.id = "endtask";
                    saveArgs.innerHTML = "Save";
                    saveArgs.onclick = function () {
                        items.arguments = argsInput.value;
                        loadCollection();

                        jsonStr = JSON.stringify(jsonData, null, "\t");
                        console.log(jsonStr);
                        fs.writeFile(configDir + '/games.json', jsonStr, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });

                        taskname.remove()
                    }
                    taskname.appendChild(saveArgs)

                    let deleteNo = document.createElement("button");
                    deleteNo.id = "endtask";
                    deleteNo.innerHTML = "Cancel";
                    deleteNo.onclick = function () {
                        taskname.remove()
                    }
                    taskname.appendChild(deleteNo)

                    toggleContext()
                }
                document.getElementById('emulatePrompt').onclick = function () {
                    const preferredEmulator = jsonData.preferredEmulator || "wine"
                    const dir = items.dir
                    const name = items.name

                    document.getElementById("taskmgr").style.display = "block"
                    document.getElementById("taskNavBtn").ariaSelected = "true";
                    var proc = require('child_process').exec(preferredEmulator + " " + dir);
                    proc.on('error', err => {
                        if (err.code === 'EACCES') {
                            taskname.innerHTML = "<h3>" + name + "</h3>" + ('This game may require elevated privileges to run.<br><br>');
                            elevateGame(name, dir, taskname)
                        } else {
                            taskname.innerHTML = "<h3>" + name + "</h3>" + (`An error occurred: ${err.message}<br><br>`);
                        }
                    });
                    let taskname = document.createElement("p");
                    taskname.innerHTML = "<h3>" + name + "</h3><br>" + "<button id='endtask'>Click To End Session</button>";
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
                    launchEXEC(items.dir, items.name, (items.arguments || ""))
                } else if (items.type == "flash") {
                    launchSWF(items.dir, items.banner, items.name)
                } else {
                    launchELSE(items.dir, items.banner, items.name, (items.arguments || ""))
                }
                document.getElementById('gamedetails').style.display = "block";
                if (document.getElementById("collectionbtn").ariaSelected == "true") {
                    document.getElementById('body').style.backgroundImage = "url('" + items.banner + "')";
                }
                lastGameBackground = items.banner;
                if (items.feed == "false" || items.feed == false) {
                    document.getElementById('gamefeed').style.display = "none";
                } else {
                    document.getElementById('gamefeed').src = items.feed;
                    document.getElementById('gamefeed').style.display = "block";
                }
            };

            if (index == 0) btn.click()

            gameList.appendChild(btn);
        });
    } else {
        document.getElementById('gamefeed').style.display = "none";
        document.getElementById('gamedetails').style.display = "none";
        document.getElementById('body').style.backgroundImage = "";
        lastGameBackground = "";

        let btn = document.createElement("button");
        btn.textContent = 'You have no games!';
        gameList.appendChild(btn);
    }
}

//downloads menu
function taskmgr() {
    var x = document.getElementById("taskmgr");
    if (x.style.display === "none") {
        x.style.display = "block";
        document.getElementById("taskNavBtn").ariaSelected = "true";
    } else {
        x.style.display = "none";
        document.getElementById("taskNavBtn").ariaSelected = "false";
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
    document.getElementById("taskNavBtn").ariaSelected = "true";

    if (document.getElementById('tasks').innerHTML.includes(sanitizeHtml(items.name))) return;

    let taskname = document.createElement("p");
    taskname.innerHTML = "<h3>" + items.name + "</h3>" + "Are you sure you want to remove this game from your collection?<br><br>";
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