import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: false, // Not needed for apps - only for libraries
  sourcemap: true,
  clean: true,
  target: 'es2020',
  minify: false,
  // Bundle workspace packages but keep external libs as-is
  noExternal: [
    '@repo/business/boundaries',
    '@repo/business/bounded-contexts/acmp-connector-bounded-context',
    '@repo/infrastructure/acmp-connector-infrastructure',
  ],
  // Keep these external - they must use their pre-built dist
  external: [
    '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit',
    '@scaleits-solutions-gmbh/org-lib-backend-common-kit',
    '@scaleits-solutions-gmbh/org-lib-global-common-kit',
  ],
});
