const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  dialog,
  shell,
} = require("electron");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const https = require("https");

const prisma = new PrismaClient();
function handlePrisma(arg) {
  // arg is of the form 'user.create({"data":{"name":"Alice","email":"alice@example.com"}})'
  const props = arg.split("(")[0].split(".");
  const callArgs = arg.split("(")[1].slice(0, -1);
  if (callArgs) {
    return prisma[props[0]][props[1]](JSON.parse(callArgs));
  } else {
    return prisma[props[0]][props[1]]();
  }
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webSecurity: MAIN_WINDOW_VITE_DEV_SERVER_URL ? false : true,
    },
    titleBarStyle: "hidden",
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

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
      properties: ["openFile"],
      // filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }],
    });

    return result.then(({ canceled, filePaths, bookmarks }) => {
      const base64 = fs.readFileSync(filePaths[0]).toString("base64");
      const extension = filePaths[0].split(".").pop();
      const type = getTypeFromExtension(extension);
      mainWindow.webContents.send("onChosenFile", {
        base64,
        type,
        path: filePaths[0],
      });
    });
  });

  ipcMain.on("saveFileFromUrl", (event, url) => {
    const extension = url.split(".").pop();
    if (!IMAGE_EXTENSIONS.includes(extension.toLowerCase())) {
      return;
    } else {
      const name = url.split("/").pop();
      const extension = name.split(".").pop();
      const type = getTypeFromExtension(extension);
      const localPath = path.join(process.resourcesPath, name);
      download(url, localPath, function (err) {
        const base64 = fs.readFileSync(localPath).toString("base64");
        mainWindow.webContents.send("onChosenFile", {
          base64,
          type,
          path: localPath,
        });
      });
    }
  });
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

function download(url, dest, cb) {
  //https://stackoverflow.com/a/22907134
  var file = fs.createWriteStream(dest);
  https
    .get(url, function (response) {
      response.pipe(file);
      file.on("finish", function () {
        file.close(cb);
      });
    })
    .on("error", function (err) {
      fs.unlink(dest);
      if (cb) cb(err.message);
    });
}

// !!!IMPORTANT!!! This is duplicated inside svelte/utils.ts
// TODO: Find a way to share this between the two
const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];
const VIDEO_EXTENSIONS = ["mp4", "m4v", "mpg", "mpeg", "ogg", "webm"];

function getTypeFromExtension(extension) {
  if (IMAGE_EXTENSIONS.includes(extension)) {
    return "image";
  }
  return "external";
}
