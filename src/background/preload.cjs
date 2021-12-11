// console.log("hi");

const { ipcRenderer, contextBridge } = require("electron");

const validChannels = [
  "start_download",
  "download_finished",
  "get_save_dir",
  "save_dir_selected",
  "alert",
  "store_get",
  "store_set",
  "progress_update",
];
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
