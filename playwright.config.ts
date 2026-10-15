import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 45000,
  use: {
    baseURL: process.env.PURELINE_PREVIEW_URL || "http://127.0.0.1:3000",
    channel: "msedge",
    headless: true,
    trace: "retain-on-failure",
  },
  reporter: [["list"], ["json", { outputFile: "tmp/qa/browser-results.json" }]],
  workers: 1,
});
