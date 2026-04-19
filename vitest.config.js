import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.js'],
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      css: false,
      server: {
        deps: {
          // Hace que Vitest transforme Vuetify internamente en lugar de cargarlo como modulo de Node
          // resuelve el error de .css
          inline: ['vuetify'],
        },
      },
    },
  }),
)
