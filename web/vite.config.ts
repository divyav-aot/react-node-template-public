/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom", // Use JSDOM for browser-like environment
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
  },
  build: {
    sourcemap: true,
  },
});
