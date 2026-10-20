import { defineConfig, devices } from "@playwright/test";

// 모바일(360·390px)과 PC(1280px) 화면 점검. 설치된 Chrome을 쓴다(브라우저를 따로 내려받지 않음).
// 실행: npm run build && npm run e2e
export default defineConfig({
  testDir: "e2e",
  outputDir: "e2e/.output",
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:3100",
    channel: "chrome",
    locale: "ko-KR",
  },
  projects: [
    { name: "android-360", use: { ...devices["Galaxy S9+"], viewport: { width: 360, height: 740 }, channel: "chrome" } },
    { name: "iphone-390", use: { ...devices["iPhone 13"], viewport: { width: 390, height: 844 }, channel: "chrome", browserName: "chromium" } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 }, channel: "chrome" } },
  ],
  webServer: {
    command: "npm run start -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
