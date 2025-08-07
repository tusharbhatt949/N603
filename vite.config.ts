import { defineConfig } from "vite";
import purgecss from "vite-plugin-purgecss";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    purgecss({
      content: ["./index.html", "./src/**/*.ts", "./src/**/*.html"],
    }) as unknown as any, // 👈 Fix type error
    visualizer({ open: true }) as unknown as any, // 👈 Fix type error
  ],
  build: {
    minify: "esbuild",
    rollupOptions: {
      treeshake: true,
      output:{
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("babylonjs")) {
              return "babylon"; // Separate Babylon.js into its own chunk
            }
            return "vendor"; // Other dependencies
          }
        },
      }
    },
    
  },
});
