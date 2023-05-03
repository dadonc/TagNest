import fs from "fs";
import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import util from "util";
import { pipeline } from "stream";
import { createItemWithBookmark } from "./bookmarks";
import { BrowserWindow } from "electron";
const pump = util.promisify(pipeline);

const server: FastifyInstance = Fastify({});
server.register(cors, {
  origin: true,
});

server.register(require("@fastify/multipart"), {
  limits: {
    fileSize: 100000000, // the max file size in bytes
  },
});

export default function startServer(mainWindow: BrowserWindow) {
  server.get("/ping", async (request, reply) => {
    return { pong: "okay" };
  });

  server.post("/mhtml", async (req, reply) => {
    type CreateMhtmlRequest = {
      file: any;
      fields: {
        url: {
          value: string;
        };
        title: {
          value: string;
        };
        favicon: {
          value: string;
        };
        screenshot: {
          value: string;
        };
      };
    };
    const r: any = req;
    const data = (await r.file()) as CreateMhtmlRequest;
    if (data === undefined) {
      console.error("No file received");
      return;
    }

    const fileName =
      data.fields.url.value
        .replace("https://", "")
        .replace("http://", "")
        // @ts-ignore
        .replaceAll("/", "-")
        .replaceAll(".", "_") + ".mhtml";

    const mhtmlPath = "/Users/domenic/Projects/hbr-data/" + fileName;
    await pump(data.file, fs.createWriteStream(mhtmlPath));
    const newItem = await createItemWithBookmark({
      title: data.fields.title.value,
      url: data.fields.url.value,
      mhtmlPath,
      screenshot: data.fields.screenshot.value,
    });
    mainWindow.webContents.send("openAddBookmark", { newItemId: newItem.id });
    mainWindow.show();

    reply.send({ success: true });
  });

  const start = async () => {
    try {
      await server.listen({ port: 3434 });

      const address = server.server.address();
      const port = typeof address === "string" ? address : address?.port;
      console.log(`Server listening at ${port}`);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };
  start();
  console.log("Server started");
}
