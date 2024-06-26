//load dependencies
const remote = require('@electron/remote');
const app = remote.app;
let fs = require('fs');
const createDesktopShortcut = require('create-desktop-shortcuts');
const configDir = app.getPath('userData');
const { shell } = require('electron')

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
    console.log('Game Provider List Is Not Found! Creating Game Provider List...')
    let jsontemplate = {
        "items": [
            {
                "name": "Coal Games",
                "JSONDir": "https://bobuxstation.github.io/Coal-Web/games.json"
            },
            {
                "name": "Community Repositories",
                "JSONDir": "https://bobuxstation.github.io/Coal-Web/repositories.json"
            },
            {
                "name": "Extensions & Themes",
                "JSONDir": "https://bobuxstation.github.io/Coal-Web/extensions.json"
            }
        ],
    };
    let data = JSON.stringify(jsontemplate, null, "\t");
    fs.writeFileSync(configDir + '/gameProviders.json', data);
}

//check if extension list exists
if (fs.existsSync(configDir + '/extensions.json')) { console.log('launcher extensions List Found!') } else {
    console.log('launcher extensions List Is Not Found! Creating extension List...')
    let jsontemplate = {
        "extensions": [],
    };
    let data = JSON.stringify(jsontemplate, null, "\t");
    fs.writeFileSync(configDir + '/extensions.json', data);
}

//check if achievements list exists
if (fs.existsSync(configDir + '/achievements.json')) { console.log('launcher achievements List Found!') } else {
    console.log('launcher achievements List Is Not Found! Creating achievement List...')
    let jsontemplate = {
        "items": [],
    };
    let data = JSON.stringify(jsontemplate, null, "\t");
    fs.writeFileSync(configDir + '/achievements.json', data);
}

//check if themes folder exists
if (!fs.existsSync(configDir + '/themes')) {
    fs.mkdirSync(configDir + '/themes');
    console.log('Theme Folder Created Successfully.');
} else {
    console.log('Theme Folder Exists.');
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

function compare(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}