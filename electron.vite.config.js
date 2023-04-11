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
            .sync('src/main/**/*.js')
            .map((file) => [
              relative('src/main', file.slice(0, file.length - extname(file).length)),
              file
            ])
        )
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    build: {
      outDir: 'out/inject',
      rollupOptions: {
        input: Object.fromEntries(
          glob
            .sync('src/inject/**/*.js')
            .map((file) => [
              relative('src/inject', file.slice(0, file.length - extname(file).length)),
              file
            ])
        )
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
        input: Object.fromEntries(
          glob
            .sync('src/renderer/windows/*.html')
            .map((file) => [
              relative('src/renderer/windows', file.slice(0, file.length - extname(file).length)),
              file
            ])
        )
      }
    },
    plugins: [vue()]
  }
})
