import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // <--- ALLOWS NETWORK ACCESS
    port: 5173  // Optional: Forces port 5173
  }
})