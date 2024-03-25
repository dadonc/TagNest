import https from "https";
import path from "path";
import fs from "fs";
import util from "util";
import { app, nativeImage } from "electron";
import type { SettingsJson } from "./gschert";
import { getPrismaClient } from "./prisma";

// @ts-ignore
const resourcesPath = process.resourcesPath;

// todo remove, and use promisified version, see below
export function downloadImageFromUrl(
  url: string,
  dest: string,
  cb: (res: any) => void
) {
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
      fs.unlink(dest, () => {});
      if (cb) cb(err.message);
    });
}

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

export async function getSettingsJson(): Promise<SettingsJson> {
  const filePath = path.join(resourcesPath, "save.json");
  if (fs.existsSync(filePath)) {
    const data = await readFileAsync(filePath, "utf8");
    return JSON.parse(data);
  } else {
    return createSettingsJsonAndReturn(filePath);
  }
}

async function createSettingsJsonAndReturn(
  filePath: string
): Promise<SettingsJson> {
  const initialData = {
    savePath: resourcesPath,
    latestMigration: "",
    combineBehavior: "copy",
  };
  const initialDataString = JSON.stringify(initialData, null, 2);
  await writeFileAsync(filePath, initialDataString, "utf8");
  const data = await readFileAsync(filePath, "utf8");
  return JSON.parse(data);
}

export async function updateSettingsJson(
  newSavePathJson: SettingsJson
): Promise<SettingsJson> {
  const oldJson = await getSettingsJson();
  const newSaveString = JSON.stringify(
    { ...newSavePathJson, oldSavePath: oldJson.savePath },
    null,
    2
  );
  await writeFileAsync(
    path.join(resourcesPath, "save.json"),
    newSaveString,
    "utf8"
  );
  return newSavePathJson;
}

export function downloadImageFromUrlPromisified(url: string, dest: string) {
  return new Promise((resolve, reject) => {
    //https://stackoverflow.com/a/22907134
    var file = fs.createWriteStream(dest);
    return https
      .get(url, function (response) {
        response.pipe(file);
        file.on("finish", function () {
          file.close(() => resolve(true));
        });
      })
      .on("error", function (err) {
        fs.unlink(dest, () => {});
        console.error(err);
        reject(err);
      });
  });
}

export async function downloadImageAsBase64FromUrl(url: string) {
  const extension = url.split(".").pop();
  const tempPath = path.join(resourcesPath, "temp." + extension);
  return new Promise<string>((resolve, reject) => {
    downloadImageFromUrl(url, tempPath, (err) => {
      if (err) {
        reject(err);
      }
      const base64 = fs.readFileSync(tempPath, "base64");
      fs.unlinkSync(tempPath);
      resolve(`data:image/${extension};base64,${base64}`);
    });
  });
}

export async function getBookmarksPath(filename: string) {
  const savePath = (await getSettingsJson()).savePath;
  if (!fs.existsSync(path.join(savePath, "bookmarks"))) {
    fs.mkdirSync(path.join(savePath, "bookmarks"));
  }
  return path.join(savePath, "bookmarks", filename);
}

export async function getFaviconPath(faviconName: string) {
  console.log("getFaviconPath", faviconName);
  const bookmarksPath = await getBookmarksPath("");
  console.log("bookmarksPath", bookmarksPath);
  if (!fs.existsSync(path.join(bookmarksPath, "favicons"))) {
    fs.mkdirSync(path.join(bookmarksPath, "favicons"));
  }
  return path.join(bookmarksPath, "favicons", faviconName);
}

export function getFileDatesAndSize(
  filePath: string
): Promise<{ updated: Date; size: number; created: Date }> {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) reject(err);
      resolve({
        updated: stats.mtime,
        size: stats.size,
        created: stats.birthtime,
      });
    });
  });
}

export async function saveFilePreview(filePath: string) {
  const folderPath = path.join((await getSettingsJson()).savePath, "icons");
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

  const filePreviewPath = path.join(
    folderPath,
    path.basename(filePath) + ".png"
  );
  const filePreview = await nativeImage.createThumbnailFromPath(filePath, {
    width: 256,
    height: 256,
  });
  fs.writeFileSync(filePreviewPath, filePreview.toPNG());

  const iconPath = path.join(folderPath, filePath.split(".").pop() + ".png");
  if (!fs.existsSync(iconPath)) {
    return app.getFileIcon(filePath, { size: "normal" }).then((icon) => {
      console.log(icon.getSize());
      fs.writeFileSync(iconPath, icon.toPNG());
    });
  }
  return;
}

export async function updateItemsBasedOnFiles(ids?: string[]) {
  const prisma = await getPrismaClient();
  let items;
  if (ids) {
    items = await prisma.item.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        file: true,
        text: true,
      },
    });
  } else {
    items = await prisma.item.findMany({
      include: {
        file: true,
        text: true,
      },
    });
  }
  for (const item of items) {
    await updateItemBasedOnFile(item);
  }
}

export async function updateItemBasedOnFile(item: any) {
  const prisma = await getPrismaClient();
  if (item.file) {
    const { updated, size, created } = await getFileDatesAndSize(
      item.file.path
    );
    const hasChanged =
      item.file.updated !== updated ||
      item.file.size !== size ||
      item.file.created !== created;
    if (hasChanged) {
      const updatedToUse =
        item.file.updated > updated ? item.file.updated : updated;
      const createdToUse =
        item.file.created < created ? item.file.created : created;
      await prisma.file.update({
        where: {
          id: item.file.id,
        },
        data: {
          updated: new Date(updatedToUse),
          size,
          created: new Date(createdToUse),
        },
      });
    }
  }

  if (item.type === "text" && item.file) {
    const text = fs.readFileSync(item.file.path).toString();
    const textPreview = text.slice(0, 100);
    const hasChanged =
      item.text?.preview !== textPreview ||
      item.text?.words !== Math.round(text.length / 5);
    if (hasChanged) {
      await prisma.text.update({
        where: {
          itemId: item.id,
        },
        data: {
          preview: textPreview,
          words: Math.round(text.length / 5),
        },
      });
    }
  }
  // Recreate file previews - this is necessary for external files if they were changed outside of the app
  if (item.type === "external" || item.type === "pdf") {
    saveFilePreview(item.file.path);
  }
}
