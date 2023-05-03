import { prisma } from "./ipcHandler";
type NewBookmark = {
  name: string;
  url: string;
  mhtmlPath: string;
};

export async function createItemWithBookmark(params: NewBookmark) {
  // todo: favicon, text, screenshot
  const { name, url, mhtmlPath } = params as NewBookmark;
  const newItem = await prisma.item.create({
    data: {
      name,
      url,
      bookmark: {
        create: {
          mhtmlPath,
        },
      },
    },
  });
  return newItem;
}
