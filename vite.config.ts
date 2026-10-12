import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Tailwind runs through @tailwindcss/vite, so no PostCSS plugins are needed.
  // Declaring this inline also stops Vite from searching parent directories
  // for a postcss config and picking up an unrelated one.
  css: {
    postcss: { plugins: [] },
  },
})
