// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",  // بتقدر تخليها 0.0.0.0 إذا بدك يفتح على الشبكة المحلية
    port: 5173,
    open: true,          // يفتح المتصفح أوتوماتيك
    proxy: {
      "/api": {
        target: "http://localhost:5000", // سيرفر الـ Express
        changeOrigin: true               // لتجنب مشاكل CORS
        // ما في rewrite لحتى يضل /api شغال متل ما هو
      }
    }
  }
});
