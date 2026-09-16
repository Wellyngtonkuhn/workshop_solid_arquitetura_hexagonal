import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve:{
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  test: {
    globals: true,
    environment: "node",

    include: ["src/**/*.spec.ts"],

    coverage: {
      provider: "v8",
      enabled: true,
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts"],
      exclude: [
        "**/*.spec.ts",
        "**/tests/**",
        "**/node_modules/**",
        "src/index.ts",
      ],
    },
  },
});