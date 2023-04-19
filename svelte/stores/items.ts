import prisma from "../prisma";
export const createItem = async ({
  name,
  url,
  note,
  path,
}: {
  name: string;
  url: string;
  note: string;
  path: string;
}) => {
  // TODO get file creation date
  const fileId = await prisma.file.create({
    data: {
      path,
    },
  });

  prisma.item.create({
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
};

export const getItems = async () => {
  return await prisma.item.findMany({
    include: {
      file: true,
    },
  });
};

async function getItemsDummy() {
  return (await getItems())[0];
}
export type SingleItem = Awaited<ReturnType<typeof getItemsDummy>>;
