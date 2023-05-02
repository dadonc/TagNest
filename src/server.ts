import fs from "fs";
import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import cors from "@fastify/cors";
import util from "util";
import { pipeline } from "stream";
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

export default function startServer() {
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
      };
    };
    const data = (await req.file()) as unknown as CreateMhtmlRequest;
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

    await pump(
      data.file,
      fs.createWriteStream("/Users/domenic/Projects/hbr-data/" + fileName)
    );
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
