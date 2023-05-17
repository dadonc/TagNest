import { contextBridge, ipcRenderer } from "electron";
import type { SettingsJson } from "./gschert";

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
  getSettingsJson: () => Promise<SettingsJson>;
  getNewSavePath: () => Promise<string>;
  updateSettingsJson: (json: SettingsJson) => Promise<void>;
  getCurrentWorkingDirectory: () => Promise<string>;
  createVideoPreview: (videoPath: string, itemId: string) => Promise<void>;
  saveVideoDetailsToItem: (videoPath: string, itemId: string) => Promise<void>;
  saveVideoPreviewImage: (
    imageBase64: string,
    itemName: string
  ) => Promise<void>;
  enterFullscreen: () => void;
  openDevTools: () => void;
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
  getSettingsJson: () => ipcRenderer.invoke("getSettingsJson"),
  getNewSavePath: () => ipcRenderer.invoke("getNewSavePath"),
  updateSettingsJson: (json) => ipcRenderer.invoke("updateSettingsJson", json),
  getCurrentWorkingDirectory: () =>
    ipcRenderer.invoke("getCurrentWorkingDirectory"),
  createVideoPreview: (videoPath, itemId) =>
    ipcRenderer.invoke("createVideoPreview", videoPath, itemId),
  saveVideoDetailsToItem: (videoPath, itemId) =>
    ipcRenderer.invoke("saveVideoDetailsToItem", videoPath, itemId),
  saveVideoPreviewImage: (imageBase64, itemName) =>
    ipcRenderer.invoke("saveVideoPreviewImage", imageBase64, itemName),
  enterFullscreen: () => ipcRenderer.send("enterFullscreen"),
  openDevTools: () => ipcRenderer.send("openDevTools"),
};

contextBridge.exposeInMainWorld("electron", api);
