// 결과 카드 10종(가치마다 하나)의 그림 소재. spec §5-1.
// 그림은 1순위로 남긴 가치를 상징할 뿐 유형이 아니다. 그림에 이름을 붙이지 않는다.

import type { ValueId } from "./values";

export interface ResultCardInfo {
  /** 그림 설명(대체 텍스트, 해석 프롬프트의 card.picture) */
  motif: string;
}

export const RESULT_CARDS: Record<ValueId, ResultCardInfo> = {
  self_direction: { motif: "내가 접어 날린 종이비행기" },
  stimulation: { motif: "처음 보는 길 위로 떠오르는 열기구" },
  hedonism: { motif: "햇살 아래 펼친 소풍 돗자리" },
  achievement: { motif: "산꼭대기에 꽂은 작은 깃발" },
  power: { motif: "배의 키(조타륜)" },
  security: { motif: "창에 불이 켜진 작은 집" },
  conformity: { motif: "가지런히 놓인 연필 세 자루" },
  tradition: { motif: "나이테가 보이는 큰 나무" },
  benevolence: { motif: "옆으로 기울여 씌워 준 우산" },
  universalism: { motif: "여러 종류의 꽃이 함께 핀 화단" },
};
