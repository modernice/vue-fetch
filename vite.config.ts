import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

export default defineConfig({
  plugins: [dts()],

  build: {
    lib: {
      entry: './src/index.ts',
      fileName: (format, name) => `${name}.${format === 'es' ? 'mjs' : format}`,
      formats: ['es', 'cjs'],
    },

    rollupOptions: {
      external: [
        ...Object.keys(pkg.peerDependencies),
      ],
    },
  },
})
