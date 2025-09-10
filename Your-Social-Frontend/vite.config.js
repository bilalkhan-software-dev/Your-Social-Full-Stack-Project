import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        content: ["./src/**/*.{js,jsx}"],
        theme: {
          extend: {},
        },
        plugins: [],
      },
    }),
  ],
  define: {
    global: "window",
  },
  server: {
    port: 3000,
  },
});
