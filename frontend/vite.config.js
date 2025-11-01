import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://e-commerce-store-backend-seven.vercel.app/",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "https://e-commerce-store-jade-tau.vercel.app/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
