import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import MotionResolver from 'motion-v/resolver'
import RekaUIResolver from 'reka-ui/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    commonjsOptions: {
      include: ['node_modules/**'],
    },
    target: 'esnext',
  },
  clearScreen: false,
  plugins: [
    vue(),
    tailwindcss(),
    // vueDevTools(),
    Components({
      dirs: ['./src/components', './src/views'],
      dts: './src/types/components.d.ts',
      resolvers: [
        RekaUIResolver(),
        MotionResolver(),
      ],
    }),
    AutoImport({
      dirs: ['./src/composables', './src/store'],
      dts: './src/types/auto-imports.d.ts',
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'pinia',
        {
          notivue: ['push'],
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      'simple-peer': 'simple-peer/simplepeer.min.js',
    },
  },
})
