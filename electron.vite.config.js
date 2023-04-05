import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          closeTip: resolve(__dirname, 'src/renderer/windowComponents/closeTip/index.js'),
          index: resolve(__dirname, 'src/preload/index.js')
        }
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    build: {
      rollupOptions: {
        input: {
          closeTip: resolve(__dirname, 'src/renderer/closeTip.html'),
          index: resolve(__dirname, 'src/renderer/index.html')
        }
      }
    },
    plugins: [vue()]
  }
})
