import { describe, expect, it } from "vitest";
import { formatCount, formatSeconds } from "./format";

describe("formatSeconds", () => {
  it("초, 분 초, 10분 넘게로 줄인다", () => {
    expect(formatSeconds(0)).toBe("0초");
    expect(formatSeconds(59.4)).toBe("59초");
    expect(formatSeconds(60)).toBe("1분");
    expect(formatSeconds(72)).toBe("1분 12초");
    expect(formatSeconds(599)).toBe("9분 59초");
    expect(formatSeconds(600)).toBe("10분 넘게");
    expect(formatSeconds(86_400 * 30)).toBe("10분 넘게");
  });
});

describe("formatCount", () => {
  it("큰 수도 짧게 쓴다", () => {
    expect(formatCount(0)).toBe("0");
    expect(formatCount(1_284)).toBe("1,284");
    expect(formatCount(9_999)).toBe("9,999");
    expect(formatCount(10_000)).toBe("1만");
    expect(formatCount(12_345)).toBe("1.2만");
    expect(formatCount(999_999)).toBe("99.9만");
    expect(formatCount(1_000_000)).toBe("100만");
    expect(formatCount(1_284_567)).toBe("128만");
    expect(formatCount(98_765_432)).toBe("9,876만");
    expect(formatCount(123_456_789)).toBe("1.2억");
    expect(formatCount(Number.MAX_SAFE_INTEGER)).toBe("90,071,992억");
  });

  it("어떤 수든 열두 글자를 넘지 않는다", () => {
    for (const n of [1, 99, 12_345, 1_000_000, 50_000_000, 7_000_000_000]) expect(formatCount(n).length).toBeLessThanOrEqual(12);
  });
});
