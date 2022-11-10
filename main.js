const electron = require('electron')
const {app, BrowserWindow, ipcMain, ipcRenderer, remote} = require("electron");
const fs = require('fs');
const path = require('path');

function createWindow () {

    const win = new BrowserWindow({
      width: 1000,
      height: 600,
      icon: "./assets/logo.png",
      autoHideMenuBar: true,
      frame: false,
      webPreferences: {
        enableRemoteModule: true,
        nodeIntegration: true,
        contextIsolation: false,
        webviewTag: true,
      }
    });
    require('@electron/remote/main').initialize()
    require('@electron/remote/main').enable(win.webContents)
  
    win.loadFile('index.html')
  }
  app.whenReady().then(createWindow)

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })