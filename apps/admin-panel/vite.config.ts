import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
// Note: TanStack Router plugin disabled due to Zod 4.x compatibility
// The router-generator@1.141.7 uses Zod 3.x API internally
// Using manual route tree generation instead
// import { tanstackRouter } from "@tanstack/router-plugin/vite"

// https://vite.dev/config/
export default defineConfig({
  base: "/admin-panel/",
  plugins: [
    // TanStack Router plugin disabled - using manual route tree
    // tanstackRouter({
    //   target: "react",
    //   autoCodeSplitting: true,
    // }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
