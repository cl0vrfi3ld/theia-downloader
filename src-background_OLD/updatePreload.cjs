// console.log("hi");
//const meta = require("../../package.json");

const { ipcRenderer, contextBridge, app } = require("electron");

/*
const validChannels = [];

contextBridge.exposeInMainWorld("ipc", {
  send: (channel, data) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  sendSync: (channel, data) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.sendSync(channel, data);
    }
  },
  invoke: (channel, data) => {
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
  },
  on: (channel, func) => {
    if (validChannels.includes(channel)) {
      // Strip event as it includes `sender` and is a security risk
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
*/

contextBridge.exposeInMainWorld("env", {
  node: () => process.versions.node,
  chromium: () => process.versions.chrome,
  electron: () => process.versions.electron,
  platform: () => process.platform,
});
