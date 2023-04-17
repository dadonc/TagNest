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
  const users = await prisma.user.findMany();
  return users.map((user) => {
    return { ...users, name: user.name?.toUpperCase() };
  });
};
