// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",  // you can set it to 0.0.0.0 to expose on the local network
    port: 5173,          // the port Vite dev server will run on
    open: true,          // automatically opens the browser when server starts
    proxy: {
      "/api": {
        target: "http://localhost:5000", // the Express server
        changeOrigin: true               // avoids CORS issues
        // no rewrite, so /api stays as-is
      }
    }
  }
});
