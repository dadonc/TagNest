import { app, BrowserWindow, globalShortcut } from "electron";
import path from "path";
import ipcHandler from "./ipcHandler";
import startServer from "./server";
import { updateItemsBasedOnFiles } from "./utils";
import { getPrismaClient } from "./prisma";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

export const isDev = MAIN_WINDOW_VITE_DEV_SERVER_URL ? true : false;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webSecurity: isDev ? false : true,
    },
    titleBarStyle: "hidden",
    trafficLightPosition: {
      x: 16,
      y: 16,
    },
  });

  await getPrismaClient(); // make sure the database is ready, otherwise the packaged app doesn't work on first start

  if (isDev) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    setTimeout(() => {
      mainWindow.webContents.openDevTools();
    }, 1000);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  ipcHandler(mainWindow);
  startServer(mainWindow);
  updateItemsBasedOnFiles();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
