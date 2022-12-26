const remote = require('@electron/remote');
const app = remote.app;
let fs = require('fs');
const configDir =  app.getPath('userData');

if (fs.existsSync(configDir + '/games.json')) {console.log('Game List Found!')
} else {
    console.log('Game List Is Not Found! Creating Game List...')
    let jsontemplate = {"items":[],};
    let data = JSON.stringify(jsontemplate);
    fs.writeFileSync(configDir + '/games.json', data);
}

if (fs.existsSync(configDir + '/gameProviders.json')) {console.log('Game Provider List Found!')} else {
    console.log('Game Provider List Is Not Found! Creating Game List...')
    let jsontemplate = {
        "items":[
            {
                "name":"Coal Games",
                "JSONDir":"https://bobuxstation.github.io/Coal-Web/games.json"
            },
            {
                "name":"Community games",
                "JSONDir":"https://bobuxstation.github.io/Coal-Web/communitygames.json"
            }
    ],};
    let data = JSON.stringify(jsontemplate);
    fs.writeFileSync(configDir + '/gameProviders.json', data);
}