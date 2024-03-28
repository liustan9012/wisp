import path from "path"
import react from "@vitejs/plugin-react"
// import { splitVendorChunkPlugin } from "vite";

import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: "5170",
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5100",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/imgs": {
        target: "http://127.0.0.1:5100",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/imgs/, "/static/images/"),
      },
    },
    hmr: true,
  },
  plugins: [
    react(),
    // nodeResolve(),
    visualizer({
      template: "treemap", // or sunburst
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "analyse.html", // will be saved in project's root
    }),
    // splitVendorChunkPlugin(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // if (id.includes("refractor")) {
          //   return "refractor";
          // }
          // if (id.includes("Dashboard")) {
          //   return "admin";
          // }
        },
      },
    },
  },
})
