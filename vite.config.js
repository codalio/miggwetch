import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Project Pages URL: https://codalio.github.io/miggwetch/
export default defineConfig({
  plugins: [react()],
  base: '/miggwetch/',
  build: {
    outDir: 'dist',
  },
})
