const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
// const fs = require("fs");
const Store = require("electron-store");
const ytcog = require("ytcog");
// const ytdl = require("ytdl-core");

const { URL } = require("url");

/** @type {import('electron').BrowserWindow} */
let mainWindow;
let store;

const createWindow = () => {
  // Create the browser window.
  console.log(process.env.NODE_ENV);
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("src/renderer/public/index.html");

  const schema = {
    saveDir: {
      type: "string",
    },
  };
  store = new Store({ schema });
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

ipcMain.handle("get_save_dir", async (eve, args) => {
  const selectedDir = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  console.log(selectedDir.filePaths[0]);
  return selectedDir.filePaths[0];
});

ipcMain.on("alert", async (eve, args) => {
  dialog.showMessageBoxSync(mainWindow, {
    message: args.message,
    title: args.title,
    type: "info",
  });
});

ipcMain.handle("store_get", (eve, args) => {
  return store.get(args.query);
});

ipcMain.handle("store_set", (eve, args) => {
  return store.set(args.query, args.data);
});

ipcMain.on("start_download", (eve, args) => {
  try {
    console.log(args);
    let vidId;
    if (!args.url)
      throw new Error(
        "expected url to parse for download, recieved falsy value."
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
        audioQuality: "highest",
        videoQuality: "none",
        container: "mp3",
        progress: (prog, size, total) => {
          //  bytesDownloaded += size;
          // process.stdout.write(`Progress ${Math.floor(prog)}% \r`);
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
