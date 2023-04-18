import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  nodeVersion: () => process.versions.node,
  chromeVersion: () => process.versions.chrome,
  electronVersion: () => process.versions.electron,
  prisma: (str) => ipcRenderer.invoke("prisma", str),
  onOpenAddItem: (callback) => ipcRenderer.on("openAddItem", callback), // open AddItem on shortcut
  chooseFile: () => ipcRenderer.send("chooseFile"),
  onChosenFile: (callback) => ipcRenderer.on("onChosenFile", callback),
});
