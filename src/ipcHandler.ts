import {
  BrowserWindow,
  ipcMain,
  globalShortcut,
  dialog,
  shell,
  app,
} from "electron";
import fs from "fs";
import path from "path";
import { IMAGE_EXTENSIONS, getItemTypeFromExtension } from "./gschert";
import { extractBookmarkImages, saveImageFromString } from "./bookmarks";
import {
  downloadImageFromUrl,
  getFileDatesAndSize,
  getSettingsJson,
  saveFilePreview,
  updateItemsBasedOnFiles,
  updateSettingsJson,
} from "./utils";
import { getPrismaClient } from "./prisma";
import { isDev } from "./main";
import {
  createVideoPreview,
  saveAudioLengthToItem,
  saveVideoDetailsToItem,
} from "./video";

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

    return result.then(async ({ canceled, filePaths }) => {
      if (filePaths.length > 1) {
        let allPaths: string[] = [];

        const getAllFilePaths = async (dirPath: string) => {
          const files = await fs.promises.readdir(dirPath);
          return files.map((file) => path.join(dirPath, file));
        };

        for (const filePath of filePaths) {
          const stats = await fs.promises.stat(filePath);
          if (stats.isDirectory()) {
            const filesInDirectory = await getAllFilePaths(filePath);
            allPaths = allPaths.concat(filesInDirectory);
          } else {
            allPaths.push(filePath);
          }
        }

        mainWindow.webContents.send("chosenFiles", allPaths);
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

  ipcMain.handle("openFileInDefaultApp", (event, path) => {
    return shell.openPath(path);
  });

  ipcMain.on("openFileInFileBrowser", (event, path) => {
    shell.showItemInFolder(path);
  });

  ipcMain.handle("extractBookmarkImages", async (event, mhtmlFilePath) => {
    return extractBookmarkImages(mhtmlFilePath);
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
    await createVideoPreview(videoPath);
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

  ipcMain.on("exitFullscreen", () => {
    mainWindow.setFullScreen(false);
  });

  ipcMain.on("openDevTools", () => {
    mainWindow.webContents.openDevTools();
  });

  ipcMain.on("closeDevTools", () => {
    mainWindow.webContents.closeDevTools();
  });

  ipcMain.handle("readFile", async (event, filePath) => {
    return fs.readFileSync(filePath).toString();
  });

  ipcMain.handle("writeFile", async (event, filePath, content) => {
    return fs.writeFileSync(filePath, content);
  });

  ipcMain.handle("copyFile", async (event, src, dest) => {
    fs.copyFileSync(src, dest);
    return true;
  });

  ipcMain.handle("moveFile", async (event, src, dest) => {
    fs.renameSync(src, dest);
    return true;
  });

  ipcMain.handle("deleteFile", async (event, path) => {
    if (path) {
      fs.unlinkSync(path);
    } else {
      console.log("\nNo file deleted. No path provided\n");
    }
    return true;
  });

  ipcMain.handle("saveImageFromString", async (event, data, path) => {
    return await saveImageFromString(data);
  });

  ipcMain.handle("recreateVideoPreview", async (event, videoPath, offset) => {
    await createVideoPreview(videoPath, offset);
    return true;
  });

  ipcMain.handle("saveAudioLengthToItem", async (event, audioPath, itemId) => {
    return await saveAudioLengthToItem(audioPath, itemId);
  });

  ipcMain.handle("saveTextInfoToItem", async (event, textPath, itemId) => {
    const text = fs.readFileSync(textPath).toString();
    const textPreview = text.slice(0, 1000);
    const prisma = await getPrismaClient();
    return await prisma.text.create({
      data: {
        preview: textPreview,
        words: Math.round(text.length / 5),
        item: {
          connect: {
            id: itemId,
          },
        },
      },
    });
  });

  ipcMain.handle("saveFilePreview", async (event, filePath) => {
    return await saveFilePreview(filePath);
  });

  ipcMain.handle("getFileDatesAndSize", async (event, filePath) => {
    return getFileDatesAndSize(filePath);
  });

  ipcMain.handle("updateItemsBasedOnFiles", async (event, ids) => {
    return await updateItemsBasedOnFiles(ids);
  });

  ipcMain.on("restartApp", () => {
    app.relaunch();
    app.exit(0);
  });
}
