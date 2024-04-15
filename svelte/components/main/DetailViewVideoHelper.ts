import prisma from "../../prisma";

export async function addVideoMark(videoId: string, mark: number) {
  const newMark = await prisma.videoMark.create({
    data: {
      mark,
      video: {
        connect: {
          id: videoId,
        },
      },
    },
  });
  return newMark;
}

export async function deleteMark(id: string) {
  return await prisma.videoMark.delete({
    where: {
      id,
    },
  });
}
