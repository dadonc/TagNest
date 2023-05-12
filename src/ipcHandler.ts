import {
  BrowserWindow,
  ipcMain,
  globalShortcut,
  dialog,
  shell,
} from "electron";
import fs from "fs";
import path from "path";
import { IMAGE_EXTENSIONS, getItemTypeFromExtension } from "./gschert";
import { extractBookmarkImages } from "./bookmarks";
import {
  downloadImageFromUrl,
  getMhtmlPath,
  getSavePathJson,
  updateSavePathJson,
} from "./utils";
import { getPrismaClient } from "./prisma";
import { isDev } from "./main";
import { createVideoPreview } from "./video";

async function handlePrisma(arg: string) {
  try {
    const prisma = await getPrismaClient();
    // arg is of the form 'user.create({"data":{"name":"Alice","email":"alice@example.com"}})'
    const argsIndex = arg.indexOf("(");
    const props = arg.slice(0, argsIndex).split(".");
    const callArgs = arg.slice(argsIndex + 1, -1);
    if (callArgs) {
      return prisma[props[0]][props[1]](JSON.parse(callArgs));
    } else {
      return prisma[props[0]][props[1]]();
    }
  } catch (e) {
    console.error(e);
    return e;
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

  ipcMain.on("saveFileFromUrl", async (event, url) => {
    const extension = url.split(".").pop();
    if (!IMAGE_EXTENSIONS.includes(extension.toLowerCase())) {
      return;
    } else {
      const name = url.split("/").pop();
      const extension = name.split(".").pop();
      const type = getItemTypeFromExtension(extension);
      const savePathJson = await getSavePathJson();
      const localPath = path.join(savePathJson.savePath, name);
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

  ipcMain.handle("extractBookmarkImages", async (event, mhtmlFilename) => {
    const mhtmlPath = await getMhtmlPath(mhtmlFilename);
    return extractBookmarkImages(mhtmlPath);
  });

  ipcMain.handle("readMhtml", async (event, fileName) => {
    const path = await getMhtmlPath(fileName);
    return fs.readFileSync(path).toString();
  });

  ipcMain.handle("getSavePath", async (event) => {
    return (await getSavePathJson()).savePath;
  });

  ipcMain.handle("getNewSavePath", (event) => {
    const result = dialog.showOpenDialog({
      properties: ["createDirectory", "openDirectory"],
    });
    return result.then(({ canceled, filePaths }) => {
      return filePaths[0];
    });
  });

  ipcMain.handle("setSavePath", async (event, newPath) => {
    const curr = await getSavePathJson();
    await updateSavePathJson({ ...curr, savePath: newPath });
    return true;
  });

  ipcMain.handle("getCurrentWorkingDirectory", async (event) => {
    if (isDev) {
      return process.cwd();
    } else {
      return path.join(process.resourcesPath, "app");
    }
  });

  ipcMain.handle("createVideoPreview", async (event, videoPath) => {
    await createVideoPreview(videoPath);
    return true;
  });
}
