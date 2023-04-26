import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    target: "node18",
    rollupOptions: {
      external: [
        "@prisma/client",
        // Problems? For inspiration see https://github.com/electron-vite/vite-plugin-electron/blob/main/vite.config.ts
      ],
    },
  },
});
