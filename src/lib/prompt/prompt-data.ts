// 해석 프롬프트에 넣는 데이터(version 3). 계산과 정리를 끝낸 상태로, 키는 짧은 영어, 값은 한국어로 넣는다.
// 응답 시간(밀리초), 단어·문항 id, 섞은 순서, 앱 버전은 넣지 않는다.

import { z } from "zod";
import { REFERENCES } from "@/data/references";
import { VALUES } from "@/data/values";
import { TRAITS } from "@/data/words";
import type { Analysis } from "@/lib/analysis/analyze";

export const LIMITATIONS = [
  "짧은 자기 이해 활동이에요. 검증된 심리검사나 진단이 아니에요.",
  "성격은 Mini-IPIP 20문항(특성마다 4문항)으로 봤지만 한국어판 검증과 규준이 없어서, 점수가 아니라 기운 방향으로 읽어요.",
  "가치 단어는 Schwartz 가치 이론을 참고해 앱이 고른 것이에요. 한 번 고른 결과라 그날의 기분에 따라 달라질 수 있어요.",
];

const BAND_LABEL = { high: "높은 쪽", middle: "중간", low: "낮은 쪽" } as const;

export const promptDataSchema = z.object({
  version: z.literal(3),
  date: z.string(),
  card: z.object({ value: z.string(), picture: z.string() }),
  personality: z.array(z.object({ trait: z.string(), band: z.string(), lean: z.string(), strong: z.boolean() })),
  kept_values: z.array(z.object({ rank: z.number().int(), word: z.string(), value: z.string(), meaning: z.string() })),
  let_go_words: z.array(z.string()),
  now_feelings: z.array(z.string()),
  want_to_grow: z.array(z.object({ value: z.string(), meaning: z.string() })),
  patterns: z.array(z.string()),
  hesitated: z.object({ slowest_step: z.string(), picked_then_removed: z.array(z.string()) }),
  limitations: z.array(z.string()),
  sources: z.array(z.string()),
});

export type PromptData = z.infer<typeof promptDataSchema>;

export function buildPromptData(a: Analysis): PromptData {
  return {
    version: 3,
    date: a.takenOn,
    card: { value: VALUES[a.card.valueId].label, picture: a.card.motif },
    personality: a.personality.tendencies.map((t) => ({ trait: TRAITS[t.trait].label, band: BAND_LABEL[t.band], lean: t.lean, strong: t.strong })),
    kept_values: a.values.kept.map((k) => ({ rank: k.rank, word: k.word, value: VALUES[k.valueId].label, meaning: VALUES[k.valueId].definition })),
    let_go_words: a.values.letGo.map((l) => l.word),
    now_feelings: a.now,
    want_to_grow: a.grow.map((id) => ({ value: VALUES[id].label, meaning: VALUES[id].definition })),
    patterns: a.patterns,
    hesitated: { slowest_step: a.hesitation.slowest.title, picked_then_removed: a.hesitation.removed.flatMap((r) => r.words) },
    limitations: LIMITATIONS,
    sources: REFERENCES.map((r) => r.short),
  };
}
