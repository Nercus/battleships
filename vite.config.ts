import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import MotionResolver from 'motion-v/resolver'
import RekaUIResolver from 'reka-ui/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    // vueDevTools(),
    Components({
      dts: './src/types/components.d.ts',
      dirs: ['./src/components', './src/pages', './src/layouts'],
      resolvers: [
        RekaUIResolver(),
        MotionResolver(),
      ],
    }),
    AutoImport({
      dts: './src/types/auto-imports.d.ts',
      dirs: ['./src/composables'],
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        {
          notivue: ['push'],
        },
      ],
    }),
  ],
  build: {
    commonjsOptions: {
      include: ['tailwind.config.js', 'node_modules/**'],
    },
    target: 'esnext',
  },
  clearScreen: false,
})
