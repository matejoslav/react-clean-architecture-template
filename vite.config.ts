import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          'babel-plugin-transform-typescript-metadata',
          ['@babel/plugin-proposal-decorators', { legacy: true }],
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://reqres.in',
        changeOrigin: true,
      },
    },
  },
})
