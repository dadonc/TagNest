import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        "@prisma/client",
        "fastify",
        "ffmpeg-static",
        // Problems? For inspiration see https://github.com/electron-vite/vite-plugin-electron/blob/main/vite.config.ts
      ],
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          // copied to enable prisma migration on startup
          src: "node_modules/prisma",
          dest: "node_modules",
        },
        {
          // copied to enable prisma migration on startup
          src: "node_modules/@prisma",
          dest: "node_modules",
        },
      ],
    }),
  ],
});
