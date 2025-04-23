import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import typography from "@tailwindcss/typography";

export default defineConfig({
  plugins: [
    laravel({
      input: [
        "resources/css/app.css",
        "resources/css/tiptap.css",
        "resources/js/app.ts",
      ],
      refresh: true,
    }),
    tailwindcss(),
    vue(),
    typography,
  ],
});
