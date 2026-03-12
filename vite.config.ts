import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/dovca-2026/",
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
