import { defineConfig } from "vitest/config";

export default defineConfig({
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