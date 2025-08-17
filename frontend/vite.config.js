import { defineConfig,  loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` (development or production)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        components: path.resolve(__dirname, "./src/components"),
        pages: path.resolve(__dirname, "./src/pages"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.url, // ✅ use VITE_API_URL from .env file
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
