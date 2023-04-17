import type { PrismaClient } from "@prisma/client";

declare global {
  interface Window {
    electron: {
      prisma: (a: string) => Promise<any>;
    };
  }
}

let props = "";
const prisma = new Proxy(() => {}, {
  get: function (target, name, receiver) {
    props += String(name) + ".";
    return prisma;
  },
  apply(target, thisArg, argArray) {
    const args = argArray[0] ? JSON.stringify(argArray[0]) : "";
    const callString = props.slice(0, -1) + "(" + args + ")";
    props = "";
    return window.electron.prisma(callString);
  },
}) as unknown as PrismaClient;

export default prisma;
