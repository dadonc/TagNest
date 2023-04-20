import prisma from "../prisma";
import { writable } from "svelte/store";
import { possiblyDeleteTags, updateItemTags } from "./tags";

export const items = writable<ReturnType<typeof getItems>>(getItems());

export async function createItem({
  name,
  url,
  note,
  path,
  tagString,
}: {
  name: string;
  url: string;
  note: string;
  path: string;
  tagString: string;
}) {
  // TODO get file creation date
  const fileId = await prisma.file.create({
    data: {
      path,
    },
  });

  const newItem = await prisma.item.create({
    data: {
      name,
      url,
      note,
      file: {
        connect: {
          id: fileId.id,
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
  await updateItemTags(item, tagString);
  let fileId;
  if (item.file) {
    fileId = await getFileIdByPath(item.file.path);
    if (!fileId) {
      fileId = await prisma.file.create({
        data: {
          path: item.file.path,
        },
      });
    }
  }
  return prisma.item.update({
    where: {
      id: item.id,
    },
    data: {
      name: item.name,
      url: item.url,
      note: item.note,
      file: {
        connect: {
          id: fileId?.id,
        },
      },
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
    },
  });
}

export async function getItems() {
  return await prisma.item.findMany({
    include: {
      file: true,
      tags: true,
    },
  });
}

async function getItemsDummy() {
  return (await getItems())[0];
}
export type SingleItem = Awaited<ReturnType<typeof getItemsDummy>>;

export async function refreshDisplayedItems() {
  items.set(getItems());
}

export async function deleteItem(id: string) {
  const item = await getItem(id);
  if (!item) return;
  possiblyDeleteTags(item.tags.map((tag) => tag.id));
  return await prisma.item.delete({
    where: {
      id,
    },
  });
}

export async function deleteItems(ids: string[]) {
  return await prisma.item.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
}
