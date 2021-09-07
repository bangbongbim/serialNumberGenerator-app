// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron");
const path = require("path");

// require("electron-reload")(__dirname, {
//   electron: path.join(__dirname, "node_modules", ".bin", "electron"),
// });

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  mainWindow.webContents.openDevTools();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

//  ipcMain

let receivedData = [];
let formData = {};

//  formData
ipcMain.on("setFormData", (event, arg) => {
  formData = arg;
});

ipcMain.on("getFormData", (event) => {
  event.sender.send("getFormData-reply", formData);
});

//  시리얼 넘버생성

ipcMain.on("setGenerateSerialNumbers", (event, arg) => {
  receivedData = arg;
});

ipcMain.on("getGeneratedSerialNumbers", (event) => {
  event.sender.send("getGeneratedSerialNumbers-reply", receivedData);
});
