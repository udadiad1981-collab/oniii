import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 120000,
  expect: { timeout: 20000 },
  retries: 0,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 15000,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium", launchOptions: { args: ["--no-sandbox"] } },
    },
  ],
  reporter: [["list"], ["html", { outputFolder: "playwright-report" }]],
  outputDir: "test-results",
});
