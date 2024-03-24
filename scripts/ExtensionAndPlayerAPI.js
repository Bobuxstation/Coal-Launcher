const ipcMain = remote.ipcMain

ipcMain.on('add-game', (event, data) => {
    if (data.name && data.ver && data.dev && data.banner && data.dir && data.type) {
        var obj = (jsonData);

        if (!data.feed) {
            obj['items'].push({
                "name": data.name,
                "feed": false,
                "Version": data.ver,
                "developer": data.dev,
                "banner": data.banner,
                "dir": data.dir,
                "type": data.type
            });
        } else {
            obj['items'].push({
                "name": data.name,
                "feed": data.feed,
                "Version": data.ver,
                "developer": data.dev,
                "banner": data.banner,
                "dir": data.dir,
                "type": data.type
            });
        }

        jsonStr = JSON.stringify(obj, null, "\t");
        fs.writeFile(configDir + '/games.json', jsonStr, (err) => {
            if (err) {
                console.log(err);
            }
        });
        loadCollection()
    }
});

ipcMain.on('add-provider', (event, data) => {
    if (data.name && data.JSONDir) {
        var obj = (gameProviderList);

        obj['items'].push({
            "name": data.name,
            "JSONDir": data.JSONDir
        });

        jsonStr = JSON.stringify(obj, null, "\t");
        fs.writeFile(configDir + '/gameProviders.json', jsonStr, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
});

ipcMain.on('new-medal', (event, data) => {
    if (data.game && data.title && data.desc && data.banner) {
        var obj = (achievementsList);
        var achievementToAdd = {
            "game": data.game,
            "title": data.title,
            "desc": data.desc,
            "banner": data.banner
        }

        if (achievementsList.items.find(
            obj => obj.game === data.game &&
                obj.title === data.title &&
                obj.desc === data.desc
                && obj.banner === data.banner
        )) return;
        obj['items'].push(achievementToAdd);

        jsonStr = JSON.stringify(obj, null, "\t");
        fs.writeFile(configDir + '/achievements.json', jsonStr, (err) => {
            if (err) {
                console.log(err);
            }
        });
        loadAchievements("")
    }
});

ipcMain.on('new-html-player', (event, data) => {
    if (data.name && data.banner && data.dir) {
        HTMLChildWindow(data.dir, data.banner, data.name)
    }
});

ipcMain.on('new-flash-player', (event, data) => {
    if (data.name && data.banner && data.dir) {
        FlashChildWindow(data.dir, data.banner, data.name)
    }
});