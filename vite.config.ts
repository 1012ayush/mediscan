import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Standard way to get __dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      // Optional: only enable overlay in development
      mode !== "production" ? require("@vitejs/plugin-react")() : undefined,
    ].filter(Boolean), // Remove undefined

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },

    root: path.resolve(__dirname, "client"),

    build: {
      // Vercel expects "dist" folder
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(__dirname, "client", "index.html"),
      },
    },

    server: {
      fs: {
        strict: true,
        deny: ["/.*"],
      },
    },
  };
});