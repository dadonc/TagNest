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
  extractBookmarkImages: (mhtmlFilePath: string) => Promise<string[]>;
  readFile: (filePath: string) => Promise<string>;
  getSettingsJson: () => Promise<SettingsJson>;
  getNewSavePath: () => Promise<string>;
  updateSettingsJson: (json: SettingsJson) => Promise<void>;
  getCurrentWorkingDirectory: () => Promise<string>;
  createVideoPreview: (videoPath: string, itemId: string) => Promise<void>;
  saveVideoDetailsToItem: (videoPath: string, itemId: string) => Promise<void>;
  saveVideoPreviewImage: (
    // todo: use file path instead of itemName
    imageBase64: string,
    itemName: string
  ) => Promise<void>;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  openDevTools: () => void;
  closeDevTools: () => void;
  // TODO: srcPath? destPath?
  copyFile: (src: string, dest: string) => Promise<void>;
  moveFile: (src: string, dest: string) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
  saveImageFromString: (data: {
    imageBase64: string;
    path: string;
    isPreview?: boolean;
  }) => Promise<string>;
  recreateVideoPreview: (videoPath: string, offset: number) => Promise<void>;
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
  extractBookmarkImages: (mhtmlFilePath) =>
    ipcRenderer.invoke("extractBookmarkImages", mhtmlFilePath),
  readFile: (filePath) => ipcRenderer.invoke("readFile", filePath),
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
  exitFullscreen: () => ipcRenderer.send("exitFullscreen"),

  openDevTools: () => ipcRenderer.send("openDevTools"),
  closeDevTools: () => ipcRenderer.send("closeDevTools"),

  copyFile: (src, dest) => ipcRenderer.invoke("copyFile", src, dest),
  moveFile: (src, dest) => ipcRenderer.invoke("moveFile", src, dest),
  deleteFile: (path) => ipcRenderer.invoke("deleteFile", path),
  saveImageFromString: (data) =>
    ipcRenderer.invoke("saveImageFromString", data),
  recreateVideoPreview: (videoPath, offset) =>
    ipcRenderer.invoke("recreateVideoPreview", videoPath, offset),
};

contextBridge.exposeInMainWorld("electron", api);
