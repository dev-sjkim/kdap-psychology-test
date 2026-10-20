// 테스트와 화면 확인용 예시 입력. 실제 사람의 응답이 아니다.

import type { TestInput } from "./analyze";

export function sampleInput(): TestInput {
  return {
    // 외향성 높음, 친화성 높음(경계 바로 위), 성실성 중간, 정서 민감성 낮음, 개방성 높음
    answers: {
      mipip_01: 5, mipip_06: 1, mipip_11: 5, mipip_16: 1, // E: 5
      mipip_02: 4, mipip_07: 2, mipip_12: 4, mipip_17: 2, // A: 4
      mipip_03: 3, mipip_08: 3, mipip_13: 3, mipip_18: 3, // C: 3
      mipip_04: 1, mipip_09: 5, mipip_14: 1, mipip_19: 5, // N: 1
      mipip_05: 5, mipip_10: 2, mipip_15: 1, mipip_20: 2, // O: 4.5
    },
    picks: {
      values: ["v_care", "v_influence", "v_leadership", "v_leisure", "v_stability", "v_growth", "v_nature"],
      narrow: ["v_care", "v_influence", "v_leadership"],
      now: ["n_absorbed", "n_relaxed", "n_busy"],
      release: ["r_carry_alone"],
      grow: ["universalism", "achievement"],
    },
    logs: {
      personality: { toggles: 21, durationMs: 62_000, removed: [] },
      values: { toggles: 9, durationMs: 24_000, removed: ["v_courtesy"] },
      narrow: { toggles: 3, durationMs: 9_000, removed: [] },
      now: { toggles: 3, durationMs: 6_000, removed: [] },
      release: { toggles: 2, durationMs: 7_000, removed: ["r_rush"] },
      grow: { toggles: 3, durationMs: 5_000, removed: ["conformity"] },
    },
    takenOn: "2026-10-20",
  };
}
