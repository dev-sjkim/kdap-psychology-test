// "평소의 나" 5지선다 10문항. Mini-IPIP(Donnellan et al., 2006, 퍼블릭 도메인)의 20문항 중
// 특성마다 정방향 1개 + 역방향 1개를 골랐다(D28). 10문항 축약은 검증된 판이 아니라서 점수가 아니라 기울기로만 쓴다.
// 번역은 앱 자체 번역(해요체)이다.

import type { TraitId } from "./words";

export interface LikertItem {
  id: string;
  text: string;
  sourceTextEn: string;
  trait: TraitId;
  keyed: "+" | "-";
}

export const LIKERT_LABELS = ["전혀 아니에요", "아닌 편이에요", "보통이에요", "그런 편이에요", "정말 그래요"] as const;
export const LIKERT_MIN = 1;
export const LIKERT_MAX = 5;

const item = (id: string, trait: TraitId, keyed: "+" | "-", sourceTextEn: string, text: string): LikertItem => ({ id, trait, keyed, sourceTextEn, text });

/** 화면에 나오는 순서. 같은 특성이 연달아 나오지 않게 섞어 두었다. */
export const LIKERT_ITEMS: LikertItem[] = [
  item("mipip_01", "extraversion", "+", "Am the life of the party.", "모임에서 분위기를 띄우는 편이에요."),
  item("mipip_02", "agreeableness", "+", "Sympathize with others' feelings.", "다른 사람의 감정에 잘 공감해요."),
  item("mipip_13", "conscientiousness", "+", "Like order.", "정돈되고 질서 있는 게 좋아요."),
  item("mipip_04", "neuroticism", "+", "Have frequent mood swings.", "기분이 자주 오르락내리락해요."),
  item("mipip_05", "openness", "+", "Have a vivid imagination.", "상상력이 풍부해요."),
  item("mipip_06", "extraversion", "-", "Don't talk a lot.", "말을 많이 하지 않아요."),
  item("mipip_07", "agreeableness", "-", "Am not interested in other people's problems.", "다른 사람의 고민에는 별로 관심이 없어요."),
  item("mipip_08", "conscientiousness", "-", "Often forget to put things back in their proper place.", "물건을 쓰고 나서 제자리에 두는 걸 자주 잊어요."),
  item("mipip_09", "neuroticism", "-", "Am relaxed most of the time.", "대체로 마음이 느긋해요."),
  item("mipip_10", "openness", "-", "Am not interested in abstract ideas.", "추상적인 생각에는 관심이 없어요."),
];

export const LIKERT_BY_ID = new Map(LIKERT_ITEMS.map((i) => [i.id, i]));
