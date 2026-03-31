import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    compilerOptions: {
      ignoreDeprecations: '6.0',
    },
  },
  clean: true,
  sourcemap: true,
  outDir: 'dist',
  target: 'es2022',
  splitting: false,
  treeshake: true,
  minify: false,
  external: [],
  noExternal: [],
  banner: {
    js: '// CurrencyX - Modern TypeScript currency converter',
  },
})
