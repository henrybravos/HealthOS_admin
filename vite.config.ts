import react from "@vitejs/plugin-react"
import { URL, fileURLToPath } from "node:url"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
      "@common": fileURLToPath(new URL("./src/common", import.meta.url)),
      "@core": fileURLToPath(new URL("./src/core", import.meta.url)),
      "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      "@routes": fileURLToPath(new URL("./src/routes", import.meta.url)),
      "@hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
      "@context": fileURLToPath(new URL("./src/context", import.meta.url))
    }
  },
  server: {
    host: true
  }
})
