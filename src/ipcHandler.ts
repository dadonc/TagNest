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
  getSettingsJson,
  updateSettingsJson,
} from "./utils";
import { getPrismaClient } from "./prisma";
import { isDev } from "./main";
import { createVideoPreview, saveVideoDetailsToItem } from "./video";

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
      const savePathJson = await getSettingsJson();
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

  ipcMain.handle("getSettingsJson", async (event) => {
    return await getSettingsJson();
  });

  ipcMain.handle("getNewSavePath", (event) => {
    const result = dialog.showOpenDialog({
      properties: ["createDirectory", "openDirectory"],
    });
    return result.then(({ canceled, filePaths }) => {
      return filePaths[0];
    });
  });

  ipcMain.handle("updateSettingsJson", async (event, json) => {
    const curr = await getSettingsJson();
    await updateSettingsJson({ ...curr, ...json });
    return true;
  });

  ipcMain.handle("getCurrentWorkingDirectory", async (event) => {
    if (isDev) {
      return process.cwd();
    } else {
      return path.join(process.resourcesPath, "app");
    }
  });

  ipcMain.handle("createVideoPreview", async (event, videoPath, itemId) => {
    await createVideoPreview(videoPath, itemId);
    return true;
  });

  ipcMain.handle("saveVideoDetailsToItem", async (event, videoPath, itemId) => {
    await saveVideoDetailsToItem(videoPath, itemId);
    return true;
  });

  ipcMain.handle("saveVideoPreviewImage", async (event, imgBase64, name) => {
    const savePath = (await getSettingsJson()).savePath;
    const outDir = path.join(savePath, "previews", "videos");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(path.join(savePath, "previews"));
      fs.mkdirSync(path.join(savePath, "previews", "videos"));
    }
    var buffer = Buffer.from(
      imgBase64.slice("data:image/png;base64,".length),
      "base64"
    );

    fs.writeFileSync(path.join(outDir, name), buffer);
  });

  ipcMain.on("enterFullscreen", () => {
    mainWindow.setFullScreen(true);
  });

  ipcMain.on("openDevTools", () => {
    mainWindow.webContents.openDevTools();
  });
}
