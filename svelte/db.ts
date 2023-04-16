import prisma from "./prisma";

export const createUser = async () => {
  return prisma.user.create({
    data: {
      name: "Bobby3",
      email: "Stuff3",
    },
  });
};

export const getUsers = async () => {
  return await prisma.user.findMany();
};
