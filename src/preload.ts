import { contextBridge, ipcRenderer } from "electron";

export type ExposedInMainWorld = {
  prisma: (str: string) => Promise<any>;
  onOpenAddItem: (callback: () => void) => void;
  chooseFile: () => void;
  onChosenFile: (
    callback: (
      ev: Electron.IpcRendererEvent,
      args: {
        path: string;
        itemType: string;
      }
    ) => void
  ) => void;
  removeChosenFileListener: () => void;
  onChosenFiles: (
    callback: (ev: Electron.IpcRendererEvent, filePaths: string[]) => void
  ) => void;
  removeChosenFilesListener: () => void;
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
  extractBookmarkImages: (fileName: string) => Promise<string[]>;
  readMhtml: (fileName: string) => Promise<string>;
  getSavePath: () => Promise<string>;
  getNewSavePath: () => Promise<string>;
  setSavePath: (path: string) => Promise<void>;
  getCurrentWorkingDirectory: () => Promise<string>;
  createVideoPreview: (videoPath: string) => Promise<void>;
};

const api: ExposedInMainWorld = {
  prisma: (str) => ipcRenderer.invoke("prisma", str),
  onOpenAddItem: (callback) => ipcRenderer.on("openAddItem", callback), // open AddItem on shortcut
  chooseFile: () => ipcRenderer.send("chooseFile"), // open file dialog
  onChosenFile: (callback) => ipcRenderer.on("chosenFile", callback), // get chosen file
  removeChosenFileListener: () => ipcRenderer.removeAllListeners("chosenFile"),
  onChosenFiles: (filePaths) => ipcRenderer.on("chosenFiles", filePaths),
  removeChosenFilesListener: () =>
    ipcRenderer.removeAllListeners("chosenFiles"),
  saveFileFromUrl: (url) => ipcRenderer.send("saveFileFromUrl", url),
  openFileInDefaultApp: (path) =>
    ipcRenderer.send("openFileInDefaultApp", path),
  onOpenAddBookmark: (callback) => ipcRenderer.on("openAddBookmark", callback),
  extractBookmarkImages: (fileName) =>
    ipcRenderer.invoke("extractBookmarkImages", fileName),
  readMhtml: (fileName) => ipcRenderer.invoke("readMhtml", fileName),
  getSavePath: () => ipcRenderer.invoke("getSavePath"),
  getNewSavePath: () => ipcRenderer.invoke("getNewSavePath"),
  setSavePath: (path) => ipcRenderer.invoke("setSavePath", path),
  getCurrentWorkingDirectory: () =>
    ipcRenderer.invoke("getCurrentWorkingDirectory"),
  createVideoPreview: (videoPath) =>
    ipcRenderer.invoke("createVideoPreview", videoPath),
};

contextBridge.exposeInMainWorld("electron", api);
