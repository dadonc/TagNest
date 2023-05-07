import {
  BrowserWindow,
  ipcMain,
  globalShortcut,
  dialog,
  shell,
} from "electron";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { IMAGE_EXTENSIONS, getItemTypeFromExtension } from "./gschert";
import { extractBookmarkImages } from "./bookmarks";
import { downloadImageFromUrl } from "./utils";

export const prisma = new PrismaClient();
function handlePrisma(arg: string) {
  // arg is of the form 'user.create({"data":{"name":"Alice","email":"alice@example.com"}})'
  const props = arg.split("(")[0].split(".");
  const callArgs = arg.split("(")[1].slice(0, -1);
  if (callArgs) {
    return prisma[props[0]][props[1]](JSON.parse(callArgs));
  } else {
    return prisma[props[0]][props[1]]();
  }
}

export default function ipcHandler(mainWindow: BrowserWindow) {
  globalShortcut.register("CommandOrControl+Shift+I", () => {
    mainWindow.webContents.send("openAddItem");
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  ipcMain.handle("prisma", (channel, arg) => handlePrisma(arg));

  ipcMain.on("chooseFile", (event, arg) => {
    const result = dialog.showOpenDialog({
      properties: [
        "openFile",
        "multiSelections",
        "showHiddenFiles",
        "openDirectory",
      ],
    });

    return result.then(({ canceled, filePaths }) => {
      if (filePaths.length > 1) {
        mainWindow.webContents.send("chosenFiles", filePaths);
      } else {
        const extension = filePaths[0].split(".").pop();
        const itemType = getItemTypeFromExtension(extension);
        mainWindow.webContents.send("chosenFile", {
          itemType,
          path: filePaths[0],
        });
      }
    });
  });

  ipcMain.on("saveFileFromUrl", (event, url) => {
    const extension = url.split(".").pop();
    if (!IMAGE_EXTENSIONS.includes(extension.toLowerCase())) {
      return;
    } else {
      const name = url.split("/").pop();
      const extension = name.split(".").pop();
      const type = getItemTypeFromExtension(extension);
      const localPath = path.join(process.resourcesPath, name);
      downloadImageFromUrl(url, localPath, function (err) {
        const base64 = fs.readFileSync(localPath).toString("base64");
        mainWindow.webContents.send("onChosenFile", {
          base64,
          type,
          path: localPath,
        });
      });
    }
  });

  ipcMain.on("openFileInDefaultApp", (event, path) => {
    shell.openPath(path);
  });

  ipcMain.handle("extractBookmarkImages", (event, mhtmlPath) => {
    return extractBookmarkImages(mhtmlPath);
  });

  ipcMain.handle("readFile", (event, path) => {
    return fs.readFileSync(path).toString();
  });
}
