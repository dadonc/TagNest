import type { PrismaClient } from "@prisma/client";

let props = "";
const prisma = new Proxy(() => {}, {
  get: function (_, name, __) {
    props += String(name) + ".";
    return prisma;
  },
  apply(_, __, argArray) {
    const args = argArray[0] ? JSON.stringify(argArray[0]) : "";
    const callString = props.slice(0, -1) + "(" + args + ")";
    props = "";
    return window.electron.prisma(callString);
  },
}) as unknown as PrismaClient;

export default prisma;
