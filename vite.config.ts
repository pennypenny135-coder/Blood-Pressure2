import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'  // 如果你用 React（通常有 src/ 就用）
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',  // 必須！打包後路徑相對，PWA 必要

  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',  // 自動更新版本
      devOptions: {
        enabled: true  // 開發時也開啟 PWA 功能
      },
      includeAssets: ['favicon.ico', '*.png', '*.svg', '*.json'],
      manifest: {
        name: 'Blood Pressure 血壓記錄',    // 你的 App 名稱
        short_name: '血壓記錄',
        description: '血壓監測與記錄工具',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,json}']
      }
    })
  ],

  build: {
    target: 'es2015',
    sourcemap: false
  }
})