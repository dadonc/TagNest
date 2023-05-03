import fs from "fs";
import { prisma } from "./ipcHandler";
type NewBookmark = {
  title: string;
  url: string;
  mhtmlPath: string;
  screenshot: string;
};

export async function createItemWithBookmark(params: NewBookmark) {
  // todo: favicon, text, screenshot
  const { title, url, mhtmlPath } = params as NewBookmark;
  const newItem = await prisma.item.create({
    data: {
      name: title,
      url,
      type: "bookmark",
      file: {
        create: {
          path: params.screenshot,
        },
      },
      bookmark: {
        create: {
          mhtmlPath,
          screenshot: params.screenshot,
        },
      },
    },
  });
  return newItem;
}

export function extractBookmarkImages(mhtmlPath: string, faviconPath?: string) {
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
    if (path.trim() !== faviconPath) {
      return `data:image/${type};base64,${base64}`;
    }
  });
  imgObjs = imgObjs.filter((imgObj) => imgObj);
  return imgObjs.sort((a, b) => {
    if (a && b) return b.length - a.length;
    return 0;
  });
}
