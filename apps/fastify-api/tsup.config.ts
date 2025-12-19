import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  shims: true,
  dts: false, // Not needed for apps - only for libraries
  sourcemap: true,
  clean: true,
  target: "es2020",
  minify: false,
  // Bundle workspace packages but keep external libs as-is
  noExternal: [
    "@repo/modules/acmp-connector",
    "@repo/modules/acmp-connector",
    "@repo/infrastructure",
  ],
  // Keep these external - they must use their pre-built dist
  external: [
    "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit",
    "@scaleits-solutions-gmbh/org-lib-backend-common-kit",
    "@scaleits-solutions-gmbh/org-lib-global-common-kit",
  ],
});
