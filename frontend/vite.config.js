import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/nlp/prediksi-berita/",
  plugins: [react()],
  build: {
    outDir: "../dist",
  },
  server: {
    port: 8080,
  },
  // Optional: Silence Sass deprecation warnings. See note below.
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          "import",
          "mixed-decls",
          "color-functions",
          "global-builtin",
        ],
      },
    },
  },
});
