import type { PrismaClient } from "@prisma/client";

declare global {
  interface Window {
    electron: {
      prisma: (a: string) => Promise<any>;
    };
  }
}

let methods = "";
const prisma = new Proxy(() => {}, {
  get: function (target, name, receiver) {
    methods += String(name) + ".";
    return prisma;
  },
  apply(target, thisArg, argArray) {
    const callString =
      methods.slice(0, -1) + "(" + JSON.stringify(argArray[0]) + ")";
    methods = "";
    return window.electron.prisma(callString);
  },
}) as unknown as PrismaClient;

export default prisma;
