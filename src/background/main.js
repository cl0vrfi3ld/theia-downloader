const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const nativeLog = require("electron-log");
// const fs = require("fs");

const ytcog = require("ytcog");
// const ytdl = require("ytdl-core");

const { URL } = require("url");

/** @type {import('electron').BrowserWindow} */
let mainWindow;

let nodeLog = console.log;

console.log = nativeLog.log;

Object.assign(console, nativeLog.functions);

nativeLog.catchErrors();
// widevine stuff
/*
app.commandLine.appendSwitch("widevine-cdm-path", "../resources");
app.commandLine.appendSwitch("widevine-cdm-version", "4.10.2391.0");
*/
console.log(__dirname);

const createWindow = () => {
  // Create the browser window.
  console.log(process.env.NODE_ENV);
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 345,
    minHeight: 600,
    titleBarStyle: process.platform === "darwin" ? "hidden" : "hidden",
    titleBarOverlay: process.platform === "win32" && {
      color: "#000",
      symbolColor: "#fff",
      height: 28,
    },
    autoHideMenuBar: true,

    // transparent: true,

    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      webgl: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("src/renderer/public/index.html");
  // mainWindow.loadURL("https://shaka-player-demo.appspot.com/");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ipc time!

// prompts user to choose a folder to save music to, then returns the path to the renderer
ipcMain.handle("get_save_dir", async (eve, args) => {
  const selectedDir = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  console.log(selectedDir.filePaths[0]);
  return selectedDir.filePaths[0];
});

ipcMain.handle("get_app_version", async (eve, args) => {
  const app_version = app.getVersion();
  return app_version;
});

// like browser `alert()`, but native
ipcMain.on("alert", (eve, args) => {
  dialog.showMessageBoxSync(mainWindow, {
    message: args.message,
    title: args.title,
    type: "info",
  });
});

// download a song
ipcMain.on("start_download", (eve, args) => {
  try {
    console.log(args);
    let vidId;
    if (!args.url)
      throw new Error(
        "expected url to parse for download, received falsy value."
      );

    const urlObj = new URL(args.url);

    if (urlObj.hostname === "youtu.be") {
      // console.log(urlObj.pathname.slice(1));
      vidId = urlObj.pathname.slice(1);
      //
    } else {
      // console.log(urlObj.searchParams.get("v"));
      vidId = urlObj.searchParams.get("v");
    }
    console.log("starting dl");
    ytcog
      .dl({
        id: vidId,
        path: args.dirPath,
        filename: "${title}",
        audioQuality: args.quality,
        videoQuality: "none",
        container: args.container,
        progress: (prog, size, total) => {
          // send progress to renderer
          mainWindow.webContents.send("progress_update", Math.floor(prog));
        },
      })
      .then((res) => {
        eve.reply("download_finished", { success: true });
      });
    /* ffmpeg(ytdl(args.url))
        .format("mp3")
        .output(path.join(args.dirPath, `${args.fileName}.mp3`));*/
  } catch (err) {
    eve.reply("download_finished", { success: false, err });
  }
});
