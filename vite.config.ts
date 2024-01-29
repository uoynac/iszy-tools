'use strict'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'node:path'
import Sitemap from './src/plugins/Sitemap.js'
import tools from './src/tools.json'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import basicSsl from '@vitejs/plugin-basic-ssl'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    basicSsl(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        AntDesignVueResolver()
      ],
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core'
      ],
      eslintrc: {
        enabled: true
      },
      dirs: ['src/composables', 'src/stores'],
      vueTemplate: true,
      dts: 'src/auto-imports.d.ts'
    }),
    Unocss(),
    Components({
      include: [/\.vue$/, /\.vue\?vue/],
      dirs: ['src/components'],
      extensions: ['vue'],
      dts: 'src/components.d.ts',
      resolvers: [
        ElementPlusResolver(),
        AntDesignVueResolver()
      ]
    }),
    VitePWA({
      scope: '/',
      manifest: {
        id: 'iszy_tools',
        name: 'ISZY工具集合',
        short_name: 'ISZY TOOLS',
        icons: [
          {
            src: '/images/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/images/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/images/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/images/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone'
      },
      workbox: {
        globPatterns: ['**/*'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*cdn\.iszy\.xyz/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'iszy-cdn',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    Sitemap({ tools, hostname: 'https://tools.iszy.xyz' }),
    VueDevTools()
  ],
  optimizeDeps: {
    include: ['vue', 'element-plus', 'ant-design-vue']
  },
  resolve: {
    alias: {
      '@': resolve('src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js'
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: { charset: false },
      less: {
        javascriptEnabled: true
      }
    }
  },
  worker: {
    format: 'es'
  },
  test: {
    environment: 'jsdom'
  }
})
