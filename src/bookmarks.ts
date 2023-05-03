import fs from "fs";
import { prisma } from "./ipcHandler";
import { downloadImageFromUrlPromisified } from "./utils";
type NewBookmark = {
  title: string;
  url: string;
  mhtmlPath: string;
  screenshot: string;
  faviconUrl: string;
};

export async function createItemWithBookmark({
  title,
  url,
  mhtmlPath,
  screenshot,
  faviconUrl,
}: NewBookmark) {
  // todo: text
  const faviconPath = await getOrDownloadFavicon(url, faviconUrl);
  const newItem = await prisma.item.create({
    data: {
      name: title,
      url,
      type: "bookmark",
      file: {
        create: {
          path: screenshot,
        },
      },
      bookmark: {
        create: {
          mhtmlPath,
          screenshot,
          faviconPath,
        },
      },
    },
  });
  return newItem;
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
    const path = part.slice(urlStart, urlEnd);
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
  const faviconPath = "/Users/domenic/Projects/hbr-data/" + faviconName;
  if (fs.existsSync(faviconPath)) {
    return faviconPath;
  } else {
    await downloadImageFromUrlPromisified(faviconUrl, faviconPath);
    return faviconPath;
  }
}
