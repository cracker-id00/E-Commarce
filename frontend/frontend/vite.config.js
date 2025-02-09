import { defineConfig } from 'vite'
import tailwindscss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),tailwindscss()],
})
