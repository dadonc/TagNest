import { contextBridge, ipcRenderer } from "electron";

export type ExposedInMainWorld = {
  nodeVersion: () => string;
  chromeVersion: () => string;
  electronVersion: () => string;
  prisma: (str: string) => Promise<any>;
  onOpenAddItem: (callback: () => void) => void;
  chooseFile: () => void;
  onChosenFile: (
    callback: (
      ev: Electron.IpcRendererEvent,
      args: {
        base64: string;
        path: string;
        type: string;
      }
    ) => void
  ) => void;
  saveFileFromUrl: (url: string) => void;
  openFileInDefaultApp: (path: string) => void;
  onOpenAddBookmark: (
    callback: (
      ev: Electron.IpcRendererEvent,
      args: {
        newItemId: string;
      }
    ) => void
  ) => void;
  extractBookmarkImages: (path: string) => Promise<string[]>;
};

const api: ExposedInMainWorld = {
  nodeVersion: () => process.versions.node,
  chromeVersion: () => process.versions.chrome,
  electronVersion: () => process.versions.electron,
  prisma: (str) => ipcRenderer.invoke("prisma", str),
  onOpenAddItem: (callback) => ipcRenderer.on("openAddItem", callback), // open AddItem on shortcut
  chooseFile: () => ipcRenderer.send("chooseFile"), // open file dialog
  onChosenFile: (callback) => ipcRenderer.on("onChosenFile", callback), // get chosen file
  saveFileFromUrl: (url) => ipcRenderer.send("saveFileFromUrl", url),
  openFileInDefaultApp: (path) =>
    ipcRenderer.send("openFileInDefaultApp", path),
  onOpenAddBookmark: (callback) => ipcRenderer.on("openAddBookmark", callback),
  extractBookmarkImages: (path) =>
    ipcRenderer.invoke("extractBookmarkImages", path),
};

contextBridge.exposeInMainWorld("electron", api);
