import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "node:url";
import path from "node:path";

const r = (p: string) =>
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), p);

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: [
        "./tsconfig.e2e.json",
        r(
          "../../../packages/business/bounded-contexts/acmp-connector-bounded-context/tsconfig.json",
        ),
      ],
    }),
  ],
  resolve: {
    alias: {
      // Vite/Vitest can't resolve our multi-slash workspace specifiers reliably at runtime.
      // For e2e we only need the boundaries package as a runtime dependency (handlers use its mappers).
      "@repo/modules/acmp-connector": r(
        "../../../packages/business/boundaries/src/index.ts",
      ),
      // Boundaries depends on bounded-context types/value-objects at runtime.
      "@repo/modules/acmp-connector": r(
        "../../../packages/business/bounded-contexts/acmp-connector-bounded-context/src/index.ts",
      ),
    },
  },
  test: {
    environment: "node",
    include: ["test/e2e/**/*.test.ts"],
    globalSetup: ["test/e2e/_helpers/global-setup.ts"],
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
});
