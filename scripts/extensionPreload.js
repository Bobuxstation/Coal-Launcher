const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('coalAPI', {
    addGame: (data) => {
        ipcRenderer.send('add-game', data);
    },
    addProvider: (data) => {
        ipcRenderer.send('add-provider', data);
    },
    spawnPlayer: (data) => {
        ipcRenderer.send('new-html-player', data);
    },
    spawnFlashPlayer: (data) => {
        ipcRenderer.send('new-flash-player', data);
    },
    newMedal: (data) => {
        ipcRenderer.send('new-medal', data);
    }
});