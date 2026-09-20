import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      // server-only throws outside a React Server environment; tests run the pure logic directly.
      "server-only": path.resolve(import.meta.dirname, "src/test/server-only.ts"),
    },
  },
  test: { include: ["src/**/*.test.ts"] },
});
