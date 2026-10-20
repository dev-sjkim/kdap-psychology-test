// 다섯 단계. 1단계는 5지선다 문항(한 화면에 한 문항), 2~5단계는 여러 개를 고르는 화면 한 장이다(D28).

export type StepId = "personality" | "values" | "narrow" | "now" | "grow";

export interface StepDef {
  id: StepId;
  kind: "likert" | "pick";
  title: string;
  prompt: string;
  min: number;
  max: number;
  /** 누른 순서가 순위가 되는 단계 */
  ordered?: boolean;
}

export const STEPS: StepDef[] = [
  {
    id: "personality",
    kind: "likert",
    title: "평소의 나",
    prompt: "되고 싶은 모습 말고, 지금 평소의 나를 떠올리며 골라 주세요.",
    min: 20,
    max: 20,
  },
  {
    id: "values",
    kind: "pick",
    title: "마음이 끌리는 단어",
    prompt: "요즘 마음이 끌리는 단어를 5개 골라 주세요.",
    min: 5,
    max: 5,
  },
  {
    id: "narrow",
    kind: "pick",
    title: "끝까지 남길 단어",
    prompt: "그중 꼭 지키고 싶은 3개를 순서대로 눌러 주세요. 먼저 누른 게 1순위예요.",
    min: 3,
    max: 3,
    ordered: true,
  },
  {
    id: "now",
    kind: "pick",
    title: "요즘의 나",
    prompt: "요즘 내 마음과 가까운 걸 1~3개 골라 주세요.",
    min: 1,
    max: 3,
  },
  {
    id: "grow",
    kind: "pick",
    title: "더 키우고 싶은 힘",
    prompt: "앞으로 더 들이고 싶은 걸 1~2개 골라 주세요.",
    min: 1,
    max: 2,
  },
];

export const STEP_INDEX: Record<StepId, number> = Object.fromEntries(STEPS.map((s, i) => [s.id, i])) as Record<StepId, number>;

export function stepById(id: StepId): StepDef {
  return STEPS[STEP_INDEX[id]];
}
