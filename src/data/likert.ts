// "평소의 나" 5지선다 20문항 = Mini-IPIP 원판 전체(Donnellan et al., 2006). IPIP 문항은 퍼블릭 도메인이다.
// 특성마다 4문항(정방향·역방향 섞임). 원판 순서를 그대로 쓴다(D50). 번역은 앱 자체 번역(해요체)이다.

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

const item = (n: number, trait: TraitId, keyed: "+" | "-", sourceTextEn: string, text: string): LikertItem => ({
  id: `mipip_${String(n).padStart(2, "0")}`,
  trait,
  keyed,
  sourceTextEn,
  text,
});

export const LIKERT_ITEMS: LikertItem[] = [
  item(1, "extraversion", "+", "Am the life of the party.", "모임에서 분위기를 띄우는 편이에요."),
  item(2, "agreeableness", "+", "Sympathize with others' feelings.", "다른 사람의 감정에 잘 공감해요."),
  item(3, "conscientiousness", "+", "Get chores done right away.", "자잘한 일은 미루지 않고 바로 해치워요."),
  item(4, "neuroticism", "+", "Have frequent mood swings.", "기분이 자주 오르락내리락해요."),
  item(5, "openness", "+", "Have a vivid imagination.", "상상력이 풍부해요."),
  item(6, "extraversion", "-", "Don't talk a lot.", "말을 많이 하지 않아요."),
  item(7, "agreeableness", "-", "Am not interested in other people's problems.", "다른 사람의 고민에는 별로 관심이 없어요."),
  item(8, "conscientiousness", "-", "Often forget to put things back in their proper place.", "물건을 쓰고 나서 제자리에 두는 걸 자주 잊어요."),
  item(9, "neuroticism", "-", "Am relaxed most of the time.", "대체로 마음이 느긋해요."),
  item(10, "openness", "-", "Am not interested in abstract ideas.", "추상적인 생각에는 관심이 없어요."),
  item(11, "extraversion", "+", "Talk to a lot of different people at parties.", "모임에 가면 여러 사람과 두루 이야기를 나눠요."),
  item(12, "agreeableness", "+", "Feel others' emotions.", "다른 사람의 감정이 나한테도 그대로 전해져요."),
  item(13, "conscientiousness", "+", "Like order.", "정돈되고 질서 있는 게 좋아요."),
  item(14, "neuroticism", "+", "Get upset easily.", "쉽게 속상해하거나 마음이 흔들려요."),
  item(15, "openness", "-", "Have difficulty understanding abstract ideas.", "추상적인 개념은 이해하기 어려워요."),
  item(16, "extraversion", "-", "Keep in the background.", "앞에 나서기보다 뒤에 물러나 있는 편이에요."),
  item(17, "agreeableness", "-", "Am not really interested in others.", "다른 사람에게 그다지 관심이 없어요."),
  item(18, "conscientiousness", "-", "Make a mess of things.", "일을 엉망으로 만들 때가 많아요."),
  item(19, "neuroticism", "-", "Seldom feel blue.", "울적한 기분이 드는 일은 드물어요."),
  item(20, "openness", "-", "Do not have a good imagination.", "상상력이 좋은 편은 아니에요."),
];

export const LIKERT_BY_ID = new Map(LIKERT_ITEMS.map((i) => [i.id, i]));
