// 성격 특성 설명과 단어 고르기에 쓰는 단어 목록. 이 앱이 직접 고른 단어이며 검증된 척도가 아니다.
// - 성격은 5지선다 문항(src/data/likert.ts)으로 재고, 여기에는 특성별 기울기 문장만 둔다.
//   어느 쪽 끝도 나쁘게 들리지 않게, 낮은 쪽도 장점이 보이는 말로 썼다.
// - 가치 단어: Schwartz 기본가치(1992, 2012)의 10가지 가치마다 2개씩, 각 가치의 정의에 들어 있는 낱말을 일상어로 옮겼다.
// - 요즘의 나: 지금의 기분을 가볍게 고르는 단어. 점수를 매기지 않는다.

import type { ValueId } from "./values";

export type TraitId = "extraversion" | "agreeableness" | "conscientiousness" | "neuroticism" | "openness";
export type Pole = "high" | "low";

export interface TraitInfo {
  id: TraitId;
  label: string;
  /** 카드 그래프 축에 쓰는 2~3자 이름 */
  short: string;
  labelEn: string;
  /** 문항 응답이 한쪽으로 기울었을 때 쓰는 말 */
  lean: Record<Pole, string>;
}

export const TRAITS: Record<TraitId, TraitInfo> = {
  extraversion: {
    id: "extraversion",
    label: "외향성",
    short: "외향",
    labelEn: "Extraversion",
    lean: { high: "사람들 속에서 힘이 나는 쪽", low: "혼자만의 시간에서 힘을 얻는 쪽" },
  },
  agreeableness: {
    id: "agreeableness",
    label: "친화성",
    short: "친화",
    labelEn: "Agreeableness",
    lean: { high: "다른 사람 마음을 먼저 살피는 쪽", low: "할 말은 분명히 하는 쪽" },
  },
  conscientiousness: {
    id: "conscientiousness",
    label: "성실성",
    short: "성실",
    labelEn: "Conscientiousness",
    lean: { high: "미리 계획하고 챙기는 쪽", low: "흐름에 맡기고 유연한 쪽" },
  },
  neuroticism: {
    id: "neuroticism",
    label: "정서 민감성",
    short: "민감",
    labelEn: "Neuroticism",
    lean: { high: "감정을 섬세하게 느끼는 쪽", low: "마음이 잘 흔들리지 않는 쪽" },
  },
  openness: {
    id: "openness",
    label: "개방성",
    short: "개방",
    labelEn: "Openness",
    lean: { high: "새로운 생각을 즐기는 쪽", low: "현실적이고 실용적인 쪽" },
  },
};

export const TRAIT_ORDER: TraitId[] = ["extraversion", "agreeableness", "conscientiousness", "neuroticism", "openness"];

export interface ValueWord {
  id: string;
  word: string;
  value: ValueId;
}

const vw = (id: string, word: string, value: ValueId): ValueWord => ({ id, word, value });

export const VALUE_WORDS: ValueWord[] = [
  vw("v_autonomy", "자율", "self_direction"),
  vw("v_being_me", "나다움", "self_direction"),
  vw("v_adventure", "모험", "stimulation"),
  vw("v_thrill", "설렘", "stimulation"),
  vw("v_fun", "즐거움", "hedonism"),
  vw("v_leisure", "여유", "hedonism"),
  vw("v_achievement", "성취", "achievement"),
  vw("v_recognition", "인정", "achievement"),
  vw("v_influence", "영향력", "power"),
  vw("v_leadership", "리더십", "power"),
  vw("v_stability", "안정", "security"),
  vw("v_health", "건강", "security"),
  vw("v_courtesy", "예의", "conformity"),
  vw("v_restraint", "절제", "conformity"),
  vw("v_tradition", "전통", "tradition"),
  vw("v_humility", "겸손", "tradition"),
  vw("v_friendship", "우정", "benevolence"),
  vw("v_care", "배려", "benevolence"),
  vw("v_fairness", "공정", "universalism"),
  vw("v_nature", "자연", "universalism"),
];

export interface NowWord {
  id: string;
  word: string;
}

export const NOW_WORDS: NowWord[] = [
  { id: "n_excited", word: "설레요" },
  { id: "n_proud", word: "뿌듯해요" },
  { id: "n_calm", word: "평온해요" },
  { id: "n_relaxed", word: "여유로워요" },
  { id: "n_absorbed", word: "몰입하고 있어요" },
  { id: "n_hopeful", word: "기대돼요" },
  { id: "n_busy", word: "정신없이 바빠요" },
  { id: "n_tired", word: "조금 지쳤어요" },
  { id: "n_stuck", word: "답답해요" },
  { id: "n_missing", word: "뭔가 그리워요" },
  { id: "n_wavering", word: "마음이 흔들려요" },
  { id: "n_flat", word: "무덤덤해요" },
];

const ALL = new Map<string, string>([
  ...VALUE_WORDS.map((w) => [w.id, w.word] as const),
  ...NOW_WORDS.map((w) => [w.id, w.word] as const),
]);

export function wordText(id: string): string {
  const w = ALL.get(id);
  if (!w) throw new Error(`알 수 없는 단어 id: ${id}`);
  return w;
}

export const VALUE_WORD_BY_ID = new Map(VALUE_WORDS.map((w) => [w.id, w]));
