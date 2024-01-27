const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('coalAPI', {
    newMedal: (data) => {
        ipcRenderer.send('new-medal', data);
    }
});