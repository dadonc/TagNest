import prisma from "../prisma";
import { writable } from "svelte/store";

export const items = writable<ReturnType<typeof getItems>>(getItems());

export async function createItem({
  name,
  url,
  note,
  path,
}: {
  name: string;
  url: string;
  note: string;
  path: string;
}) {
  // TODO get file creation date
  const fileId = await prisma.file.create({
    data: {
      path,
    },
  });

  return prisma.item.create({
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
}

export async function getItems() {
  return await prisma.item.findMany({
    include: {
      file: true,
    },
  });
}

async function getItemsDummy() {
  return (await getItems())[0];
}
export type SingleItem = Awaited<ReturnType<typeof getItemsDummy>>;
