url: https://github.com/prisma/prisma/discussions/7889

After struggling with exposing the PrismaClient to the renderer I've found a solution using a JavaScript proxy:

Use contextBridge to expose a function to the renderer that sends a string to the main process and returns the result.
```js
// preload.js
import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electron", {
  prisma: (str) => ipcRenderer.invoke("prisma", str),
});
```

Use ipcMain.handle in the main process to receive the string and call the PrismaClient with it.
```js
// main.js
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.handle("prisma", (channel, arg) => handlePrisma(arg));
  [...]
};


const prisma = new PrismaClient();
function handlePrisma(arg) {
  // arg is of the form 'user.create({"data":{"name":"Alice","email":"alice@example.com"}})'
  const props = arg.split("(")[0].split(".");
  const callArgs = arg.split("(")[1].slice(0, -1);
  if (callArgs) {
    return prisma[props[0]][props[1]](JSON.parse(callArgs));
  } else {
    return prisma[props[0]][props[1]]();
  }
}
```

In the renderer process, create a proxy that traps any property access and builds a string of the used properties. When the proxy is called as a function it sends the string with the properties/methods and the argument to the main process and returns the result.
```ts
// prisma.ts (renderer)
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
    const arg = argArray[0] ? JSON.stringify(argArray[0]) : "";
    const callString = props.slice(0, -1) + "(" + arg + ")";
    props = "";
    return window.electron.prisma(callString);
  },
}) as unknown as PrismaClient;

export default prisma;
```

Because the proxy is typed as a PrismaClient it can be used as if it was a normal PrismaClient, including autocomplete and linting. Usage example:
```ts
// example.ts (renderer)
import prisma from "./prisma";

export const createUser = async () => {
  return prisma.user.create({
    data: {
      name: "Bob",
      email: "bob@example.com",
    },
  });
};
```


Any suggestions why this may not be a good idea or how to improve it?
