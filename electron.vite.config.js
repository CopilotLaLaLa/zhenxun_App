import { resolve, relative, extname } from 'path'
import { glob } from 'glob'
// import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: Object.fromEntries(
          glob
            .sync('src/main/*.js')
            .map((file) => [
              relative('./src/main', file.slice(0, file.length - extname(file).length)),
              file
            ])
        )
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          // closeTip: resolve(__dirname, 'src/renderer/windowComponents/closeTip/index.js'),
          // closeTip: resolve(__dirname, 'src/renderer/windowComponents/closeTip/index.js'),
          index: resolve(__dirname, './src/inject/preload.js')
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
          // closeTip: resolve(__dirname, 'src/renderer/closeTip.html'),
          index: resolve(__dirname, './src/windows/views/index.html')
        }
      }
    },
    plugins: [vue()]
  }
})
