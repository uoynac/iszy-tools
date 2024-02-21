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
import VueDevTools from 'vite-plugin-vue-devtools'
import config from './src/config'
import { createHtmlPlugin } from 'vite-plugin-html'

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
    VueDevTools(),
    createHtmlPlugin({
      entry: 'src/main.ts',
      inject: {
        data: {
          ...config
        }
      }
    }),
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
      dts: 'src/types/auto-imports.d.ts'
    }),
    Unocss(),
    Components({
      include: [/\.vue$/, /\.vue\?vue/],
      dirs: ['src/components'],
      extensions: ['vue'],
      dts: 'src/types/components.d.ts',
      resolvers: [
        ElementPlusResolver(),
        AntDesignVueResolver()
      ]
    }),
    VitePWA({
      scope: '/',
      manifest: {
        id: config.name,
        name: config.zhName,
        short_name: config.alias,
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
        globPatterns: ['**/*.html'],
        navigateFallback: null,
        runtimeCaching: [
          // api
          {
            urlPattern: ({ url }) => url.origin === config.apiOrigin,
            handler: 'NetworkFirst',
            options: {
              cacheName: `${config.key}-api`,
              cacheableResponse: {
                statuses: [200]
              }
            }
          },
          // cdn
          {
            urlPattern: ({ url }) => url.hostname.endsWith(config.cdnHost),
            handler: 'CacheFirst',
            options: {
              cacheName: `${config.key}-cdn`,
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [200]
              }
            }
          },
          // 项目文件动态缓存
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: `${config.key}-images`,
              expiration: {
                // 最多30个图
                maxEntries: 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:woff|eot|otf|ttf|TTF)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: `${config.key}-font`,
              cacheableResponse: {
                statuses: [200]
              }
            }
          },
          {
            urlPattern: /.*\.css.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: `${config.key}-css`,
              cacheableResponse: {
                statuses: [200]
              }
            }
          },
          {
            urlPattern: /.*\.js.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: `${config.key}-js`,
              cacheableResponse: {
                statuses: [200]
              }
            }
          }
        ]
      }
    }),
    Sitemap({ tools, hostname: config.siteOrigin })
  ],
  optimizeDeps: {
    include: ['vue', 'element-plus', 'ant-design-vue']
  },
  resolve: {
    alias: {
      '@': resolve('src')
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
