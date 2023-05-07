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
  extractBookmarkImages: (path: string) => Promise<string[]>;
  readFile: (path: string) => Promise<string>;
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
  extractBookmarkImages: (path) =>
    ipcRenderer.invoke("extractBookmarkImages", path),
  readFile: (path) => ipcRenderer.invoke("readFile", path),
};

contextBridge.exposeInMainWorld("electron", api);
