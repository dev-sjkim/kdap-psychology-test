// 테스트와 화면 확인용 예시 입력. 실제 사람의 응답이 아니다.

import type { TestInput } from "./analyze";

export function sampleInput(): TestInput {
  return {
    // 외향성 높음(5, 역 1), 친화성 높음(4, 역 2), 성실성 중간(3, 역 3), 정서 민감성 낮음(1, 역 5), 개방성 높음(5, 역 2)
    answers: {
      mipip_01: 5,
      mipip_06: 1,
      mipip_02: 4,
      mipip_07: 2,
      mipip_13: 3,
      mipip_08: 3,
      mipip_04: 1,
      mipip_09: 5,
      mipip_05: 5,
      mipip_10: 2,
    },
    picks: {
      values: ["v_care", "v_influence", "v_leadership", "v_leisure", "v_stability"],
      narrow: ["v_care", "v_influence", "v_leadership"],
      now: ["n_absorbed", "n_relaxed", "n_busy"],
      grow: ["universalism", "achievement"],
    },
    logs: {
      personality: { toggles: 11, durationMs: 32_000, removed: [] },
      values: { toggles: 7, durationMs: 19_000, removed: ["v_courtesy"] },
      narrow: { toggles: 3, durationMs: 9_000, removed: [] },
      now: { toggles: 3, durationMs: 6_000, removed: [] },
      grow: { toggles: 3, durationMs: 5_000, removed: ["conformity"] },
    },
    takenOn: "2026-10-20",
  };
}
