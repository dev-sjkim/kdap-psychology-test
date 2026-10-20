import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// 순수 함수 테스트는 node 환경에서 돈다. 컴포넌트 테스트는 파일 맨 위에
// `// @vitest-environment jsdom` 주석을 달아 jsdom 환경으로 바꾼다.
export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
