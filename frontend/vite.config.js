import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  base: "/", // 👈 importante para despliegue en Vercel
  build: {
    outDir: "dist", // carpeta por defecto, la usa Vercel
  },
})
