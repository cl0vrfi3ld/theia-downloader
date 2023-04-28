const { app, session, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const toml = require("@iarna/toml/parse-string");
const nativeLog = require("electron-log");
const { autoUpdater } = require("electron-updater");

// const fs = require("fs");

const ytcog = require("ytcog");

const { URL } = require("url");

// updater cfg
autoUpdater.autoDownload = false;
autoUpdater.allowPrerelease =
  process.env.EP_PRE_RELEASE === "true" ? true : false;

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

/** @type {import('electron').BrowserWindow} */
let mainWindow;

let nodeLog = console.log;

console.log = nativeLog.log;

Object.assign(console, nativeLog.functions);

nativeLog.catchErrors();

// log startup and start timer
console.log("starting the theia downloader");
console.time("theia-startup");

const parseAppConfig = () => {
  const dataRaw = fs.readFileSync(path.join(__dirname, "../app.toml"), {
    encoding: "utf-8",
  });
  // console.log(dataRaw);
  const data = toml(dataRaw);
  return data;
};
const appConfig = parseAppConfig();

// console.log(appConfig);

const createMainWindow = () => {
  // Create the browser window.
  // console.log(process.env.NODE_ENV);
  mainWindowCfg = appConfig.ui.mainWindow;

  mainWindow = new BrowserWindow({
    width: mainWindowCfg.width,
    height: mainWindowCfg.height,
    minWidth: mainWindowCfg.minWidth,
    minHeight: mainWindowCfg.minHeight,
    titleBarStyle: "hidden",
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

  // load app context
  mainWindow.loadFile("src/renderer/public/index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  return mainWindow;
};

const createUpdateWindow = (asDemo) => {
  updateWindowCfg = appConfig.ui.updateWindow;
  const updateWindow = new BrowserWindow({
    width: updateWindowCfg.width,
    height: updateWindowCfg.height,
    frame: updateWindowCfg.frame,
    resizable: updateWindowCfg.resizable,
    minimizable: updateWindowCfg.minimizable,
    closable: process.env.NODE_ENV == "development" ? true : false,
    webPreferences: {
      preload: path.join(__dirname, "updatePreload.cjs"),
      contextIsolation: true,
    },
  });
  updateWindow.loadFile("src/renderer/public/index.html", {
    hash: "#/updating",
    query: {
      demo: asDemo ? "1" : "0",
    },
  });

  return updateWindow;
};

const handleLaunch = async ({ updateWin, mainWin }) => {
  // check for updates
  const availUp = await autoUpdater.checkForUpdates();

  if (
    availUp?.updateInfo &&
    availUp?.updateInfo.version.split("-")[0].replace(".", "") >
      app.getVersion().split("-")[0].replace(".", "")
  ) {
    console.log("a newer version of the client has been found, updating...");
    // show updating screen
    const upWin = updateWin();

    // log invocation time
    console.log("invocation completed in");
    console.timeEnd("theia-startup");

    // download update
    autoUpdater.downloadUpdate(/*availUp.cancellationToken*/);

    // install update after downloaded
    autoUpdater.on("update-downloaded", (updateInfo) => {
      autoUpdater.quitAndInstall(true, true);
      // temporary bodge as quitAndInstall refuses to quit
      setTimeout(() => {
        app.exit();
      }, 10000);
    });
  } else {
    // update unavailable and/or app is on latest version
    // launch as normal
    mainWin();

    console.log("started in");
    console.timeEnd("theia-startup");
  }
};

// enable sandbox for all renderer processes
app.enableSandbox();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  handleLaunch({ updateWin: createUpdateWindow, mainWin: createMainWindow });
  // set csp
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": ["default-src 'self'"],
      },
    });
  });
});

// block app from navigating away from embedded content
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    // if next location is not a file, reject. i need to work on improving the filter to verify file contents
    if (parsedUrl.origin !== "file://") {
      event.preventDefault();
    }
  });
});

// Quit when all windows are closed
app.on("window-all-closed", () => {
  app.quit();
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

ipcMain.handle("get_quips", async (eve, res) => {
  return appConfig.ui.quips;
});

ipcMain.handle("get_app_version", async (eve, args) => {
  const app_version = app.getVersion();
  return app_version;
});

ipcMain.handle("show_update_window", async () => {
  const upWin = createUpdateWindow();

  await new Promise((res, rej) => {
    upWin.once("ready-to-show", () => res());
  });

  // upWin.show();

  console.log("attempted to launch update window preview");
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
