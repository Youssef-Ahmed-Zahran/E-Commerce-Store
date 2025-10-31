import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://e-commerce-store-chi-gules.vercel.app/",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "https://e-commerce-store-chi-gules.vercel.app/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
