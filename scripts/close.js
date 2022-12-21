const getWindow = () => remote.BrowserWindow.getFocusedWindow();

function closeWindow () {
    getWindow().close();
}

function minimizeWindow () {  
    getWindow().minimize();
}

function maximizeWindow () {
    const window = getWindow();
    window.isMaximized() ? window.unmaximize() : window.maximize();
}