import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import cors from "@fastify/cors";

const server: FastifyInstance = Fastify({});
server.register(cors, {
  origin: true,
});

export default function startServer() {
  server.get("/ping", async (request, reply) => {
    return { pong: "okay" };
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
