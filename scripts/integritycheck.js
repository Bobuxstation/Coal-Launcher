//load dependencies
const remote = require('@electron/remote');
const app = remote.app;
let fs = require('fs');
const createDesktopShortcut = require('create-desktop-shortcuts');
const configDir = app.getPath('userData');

//check if game list exists
if (fs.existsSync(configDir + '/games.json')) {
    console.log('Game List Found!')
} else {
    console.log('Game List Is Not Found! Creating Game List...')
    let jsontemplate = { "items": [], "currenttheme": "css/dark.css", "preferredEmulator": "wine" };
    let data = JSON.stringify(jsontemplate, null, "\t");
    fs.writeFileSync(configDir + '/games.json', data);
}

//check if game provider list exists
if (fs.existsSync(configDir + '/gameProviders.json')) { console.log('Game Provider List Found!') } else {
    console.log('Game Provider List Is Not Found! Creating Game List...')
    let jsontemplate = {
        "items": [
            {
                "name": "Coal Games",
                "JSONDir": "https://bobuxstation.github.io/Coal-Web/games.json"
            },
            {
                "name": "Community Games",
                "JSONDir": "https://bobuxstation.github.io/Coal-Web/communitygames.json"
            }
        ],
    };
    let data = JSON.stringify(jsontemplate, null, "\t");
    fs.writeFileSync(configDir + '/gameProviders.json', data);
}

function createShortcut(ExecFilePath) {
    const shortcutsCreated = createDesktopShortcut({
        windows: { filePath: ExecFilePath },
        linux: { filePath: ExecFilePath },
        osx: { filePath: ExecFilePath }
    });

    if (shortcutsCreated) {
        console.log('Everything worked correctly!');
    } else {
        console.log('Could not create the icon or set its permissions (in Linux if "chmod" is set to true, or not set)');
    }
}