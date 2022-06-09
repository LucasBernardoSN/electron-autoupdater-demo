const path = require('path');
const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 640,
        height: 480,
        minWidth: 500,
        minHeight: 500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            spellcheck: true,
        },
    });

    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    // <--------- Update --------->
    if (!isDev) {
        autoUpdater.checkForUpdates();
    }

    autoUpdater.on('update-downloaded', () => {
        clearInterval(checkupdates);
        autoUpdater.quitAndInstall();
    });
    // <--------- Update --------->
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

if (!isDev) {
    var checkupdates = setInterval(async () => {
        autoUpdater.checkForUpdates().then();
    }, 60000);
}