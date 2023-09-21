import fs from "fs";
import { downloadImageFromUrlPromisified, getFaviconPath } from "./utils";
import { getPrismaClient } from "./prisma";
type NewBookmark = {
  title: string;
  url: string;
  screenshotData: string;
  faviconUrl: string;
  mhtmlPath: string;
};

export async function createItemWithBookmark({
  title,
  url,
  screenshotData,
  faviconUrl,
  mhtmlPath,
}: NewBookmark) {
  // todo: extract text

  const faviconPath = await getOrDownloadFavicon(url, faviconUrl);
  const prisma = await getPrismaClient();
  const screenshotPath = mhtmlPath.replace(".mhtml", ".png");
  await saveImageFromString(screenshotData, screenshotPath);
  console.log("saved screenshot", screenshotPath);
  try {
    const newItem = await prisma.item.create({
      data: {
        name: title,
        url,
        type: "bookmark",
        file: {
          create: {
            path: mhtmlPath,
          },
        },
        bookmark: {
          create: {
            previewImagePath: screenshotPath,
            screenshotPath,
            faviconPath,
          },
        },
      },
    });
    return newItem;
  } catch (err) {
    console.error(err);
  }
}

export function extractBookmarkImages(mhtmlPath: string) {
  // read file
  const fileContents = fs.readFileSync(mhtmlPath, "utf8");
  const parts = fileContents
    .split("Content-Type: image/")
    .filter(
      (part) =>
        part.startsWith("png") ||
        part.startsWith("jpeg") ||
        part.startsWith("jpg") ||
        part.startsWith("webp")
    );
  let imgObjs = parts.map((part) => {
    const type = part.slice(0, part.indexOf("\n"));
    const urlStart = part.indexOf("Content-Location: ");
    const urlEnd = part.indexOf("\n", urlStart);
    const base64 = part.slice(urlEnd + 3, part.indexOf("\n--") - 3);
    return `data:image/${type};base64,${base64}`;
  });
  imgObjs = imgObjs.filter((imgObj) => imgObj);
  return imgObjs.sort((a, b) => {
    if (a && b) return b.length - a.length;
    return 0;
  });
}

async function getOrDownloadFavicon(websiteUrl: string, faviconUrl: string) {
  const website = websiteUrl.split("/")[2];
  const extension = faviconUrl.split(".").pop();
  //@ts-ignore
  const faviconName = website.replaceAll(".", "_") + "-favicon." + extension;
  const faviconPath = await getFaviconPath(faviconName);
  if (fs.existsSync(faviconPath)) {
    return faviconPath;
  } else {
    await downloadImageFromUrlPromisified(faviconUrl, faviconPath);
    return faviconPath;
  }
}

async function saveImageFromString(imageData: string, path: string) {
  fs.writeFileSync(path, new Buffer(imageData, "base64"));
}
