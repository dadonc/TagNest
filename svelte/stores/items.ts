import prisma from "../prisma";
import { writable } from "svelte/store";
import { possiblyDeleteTags, updateItemTags } from "./tags";

export const items = writable<Awaited<ReturnType<typeof getItems>>>(
  await getItems()
);

export async function createItem({
  name,
  url,
  note,
  tagString,
  path,
  type,
  importStep,
  getsCurrentlyImported = false,
}: {
  name: string;
  url: string;
  note: string;
  tagString: string;
  path: string;
  type: string;
  importStep: number;
  getsCurrentlyImported?: boolean;
}) {
  // TODO get file creation date

  const newItem = await prisma.item.create({
    data: {
      name,
      url,
      note,
      type,
      getsCurrentlyImported,
      importStep,
    },
  });

  await prisma.file.create({
    data: {
      path,
      item: {
        connect: {
          id: newItem.id,
        },
      },
    },
  });
  const item = await getItem(newItem.id);
  await updateItemTags(item!, tagString);
  return item;
}

async function getFileIdByPath(path: string) {
  return await prisma.file.findFirst({
    where: {
      path,
    },
  });
}

export async function updateItem(item: SingleItem, tagString: string) {
  // let fileId;
  // if (item.file) {
  //   fileId = await getFileIdByPath(item.file.path);
  //   if (!fileId) {
  //     fileId = await prisma.file.create({
  //       data: {
  //         path: item.file.path,
  //       },
  //     });
  //   }
  // }
  // let fileConnect = fileId
  //   ? {
  //       file: {
  //         connect: {
  //           id: fileId?.id,
  //         },
  //       },
  //     }
  //   : {};
  prisma.item.update({
    where: {
      id: item.id,
    },
    data: {
      name: item.name,
      url: item.url,
      note: item.note,
      type: item.type,
      importStep: item.importStep,
      // ...fileConnect,
    },
  });
  return updateItemTags(item, tagString);
}

export async function updateBookmarkPreviewImage(item: SingleItem) {
  await prisma.bookmark.update({
    where: {
      itemId: item.id,
    },
    data: {
      previewImagePath: item.bookmark?.previewImagePath,
    },
  });
}

export async function getItem(id: string) {
  return await prisma.item.findUnique({
    where: {
      id,
    },
    include: {
      file: true,
      tags: true,
      bookmark: true,
      video: true,
      audio: true,
      text: true,
    },
  });
}

export async function getItems() {
  const temp = await prisma.item.findMany({
    // where: {
    //   getsCurrentlyImported: false,
    // },
    include: {
      file: true,
      tags: true,
      bookmark: true,
      video: true,
      audio: true,
      text: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  // TODO ask Chris - using "where" errors in for example RightEditSingle
  const filtered = temp.filter((item) => !item.getsCurrentlyImported);
  // let test = filtered;
  // for (let i = 0; i < 10000; i++) {
  //   test = test.concat(filtered);
  // }
  return filtered;
}

async function getItemsDummy() {
  return (await getItems())[0];
}

export async function getItemByPath(path: string) {
  const item = await prisma.item.findFirst({
    where: {
      file: {
        path,
      },
    },
    select: {
      id: true,
    },
  });
  if (!item) return;
  return await getItem(item.id);
}
export type SingleItem = Awaited<ReturnType<typeof getItemsDummy>>;

export async function refreshDisplayedItems(src?: string) {
  console.log("Refreshing item store", src);
  const newItems = await getItems();
  items.set(newItems);
}

export async function deleteItem(id: string) {
  const item = await getItem(id);
  const tagIds = item?.tags.map((tag) => tag.id);
  if (!item) return;
  await prisma.item.delete({
    where: {
      id,
    },
  });
  return possiblyDeleteTags(tagIds || []);
}

export async function finishItemImport(id: string, importStep: number) {
  importItems.update((items) => {
    return items.filter((item) => item.id !== id);
  });
  return await prisma.item.update({
    where: {
      id,
    },
    data: {
      getsCurrentlyImported: false,
      importStep,
    },
  });
}

export type ImportItem = SingleItem & { lastImportStepUpdate?: number };
const currentImportItems = localStorage.getItem("importItems");

// TODO - rename to importItemsStore
export const importItems = writable<ImportItem[]>(
  currentImportItems ? JSON.parse(currentImportItems) : []
);

export type DeleteItem = SingleItem & {
  deleteStep: number;
  allStepsRun?: boolean;
};
const currentDeleteItems = localStorage.getItem("deleteItems");

export const deleteItemsStore = writable<DeleteItem[]>(
  currentDeleteItems ? JSON.parse(currentDeleteItems) : []
);

export async function updateFilePath(itemId: string, newPath: string) {
  await prisma.file.update({
    where: {
      itemId,
    },
    data: {
      path: newPath,
    },
  });
}
