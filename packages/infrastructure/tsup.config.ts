import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  format: ['esm', 'cjs'],
  sourcemap: true,
  clean: true,
  target: 'es2020',
  minify: false,
  external: [
    '@repo/modules/acmp-connector',
    '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit',
    '@scaleits-solutions-gmbh/org-lib-backend-common-kit',
    '@scaleits-solutions-gmbh/org-lib-global-common-kit',
    'mssql',
  ],
});
