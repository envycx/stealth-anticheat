import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}", "__tests__/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "playwright"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: [
        "node_modules/**",
        ".next/**",
        "src/app/layout.tsx",
        "src/app/page.tsx",
        "vitest.config.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
