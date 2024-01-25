// main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

let mainWindow;
let settingsWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

ipcMain.on('open-settings', () => {
  if (!settingsWindow) {
    createSettingsWindow();
  }
});

function createSettingsWindow() {
  settingsWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  settingsWindow.loadFile(path.join(__dirname, 'settings.html'));

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

ipcMain.on('open-file-dialog', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
  });

  event.reply('selected-file', result.filePaths[0]);
});

ipcMain.on('submit-form', (event, formData) => {
  console.log('Form Data:', formData);
  // Handle the form data as needed (e.g., send to a server, save to a file)
  // For now, just log the data to the console
});

// Function to log events to a file
function logEvent(eventName, eventData) {
  const logFilePath = path.join(__dirname, 'app.log');
  const logEntry = ${new Date().toLocaleString()} - ${eventName}: ${JSON.stringify(eventData)}\n;

  require('fs').appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
}
