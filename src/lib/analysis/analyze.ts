// 응답으로 결과를 만든다. 점수를 매기기보다 기울기와 눈여겨볼 연결을 정리하는 가벼운 규칙이다.
// 부수효과가 없는 순수 함수이며, 같은 입력이면 항상 같은 결과가 나온다.

import { LIKERT_ITEMS, LIKERT_MAX, LIKERT_MIN } from "@/data/likert";
import { RESULT_CARDS } from "@/data/result-cards";
import { CONFLICT_PAIRS, VALUE_IDS, VALUES, type ValueId } from "@/data/values";
import { NOW_WORDS, TRAIT_ORDER, TRAITS, VALUE_WORD_BY_ID, wordText, type TraitId } from "@/data/words";
import { josa } from "@/lib/text/josa";
import { STEPS, stepById, type StepId } from "@/lib/steps";

export type PickStepId = Exclude<StepId, "personality">;

export interface StepLog {
  toggles: number;
  durationMs: number;
  /** 골랐다가 다시 뺀 단어(마지막에 다시 고른 단어는 빼고) */
  removed: string[];
}

export interface TestInput {
  /** 문항 id → 1~5 */
  answers: Record<string, number>;
  picks: Record<PickStepId, string[]>;
  logs: Record<StepId, StepLog>;
  /** YYYY-MM-DD */
  takenOn: string;
}

export type Band = "high" | "middle" | "low";

export interface Tendency {
  trait: TraitId;
  /** 두 문항 평균(1~5) */
  mean: number;
  band: Band;
  /** 기운 쪽을 말로 */
  lean: string;
  strong: boolean;
}

export interface KeptWord {
  rank: number;
  wordId: string;
  word: string;
  valueId: ValueId;
}

export interface Analysis {
  takenOn: string;
  card: { valueId: ValueId; motif: string };
  personality: { tendencies: Tendency[]; highlights: Tendency[] };
  values: {
    picked: { word: string; valueId: ValueId }[];
    kept: KeptWord[];
    letGo: { word: string; valueId: ValueId }[];
    order: ValueId[];
  };
  now: string[];
  grow: ValueId[];
  /** 앱이 규칙으로 찾은 눈여겨볼 연결. 해석 프롬프트와 자세히 보기에 쓴다 */
  patterns: string[];
  hesitation: {
    slowest: { stepId: StepId; title: string; seconds: number };
    removed: { stepId: StepId; words: string[] }[];
  };
}

const PICK_STEPS = STEPS.filter((s) => s.kind === "pick");

function check(input: TestInput) {
  for (const item of LIKERT_ITEMS) {
    const v = input.answers[item.id];
    if (!Number.isInteger(v) || v < LIKERT_MIN || v > LIKERT_MAX) throw new Error(`평소의 나: ${item.id} 응답이 없거나 범위를 벗어났습니다.`);
  }
  for (const step of PICK_STEPS) {
    const ids = input.picks[step.id as PickStepId];
    if (ids.length < step.min || ids.length > step.max) throw new Error(`${step.title}: ${step.min}~${step.max}개를 골라야 합니다.`);
    if (new Set(ids).size !== ids.length) throw new Error(`${step.title}: 같은 단어를 두 번 고를 수 없습니다.`);
  }
  for (const id of input.picks.values) if (!VALUE_WORD_BY_ID.has(id)) throw new Error(`알 수 없는 가치 단어: ${id}`);
  for (const id of input.picks.narrow) if (!input.picks.values.includes(id)) throw new Error("남길 단어는 앞에서 고른 다섯 개 안에서 골라야 합니다.");
  for (const id of input.picks.now) if (!NOW_WORDS.some((w) => w.id === id)) throw new Error(`알 수 없는 기분 단어: ${id}`);
  for (const id of input.picks.grow) if (!VALUE_IDS.includes(id as ValueId)) throw new Error(`알 수 없는 가치: ${id}`);
}

/** 특성별 두 문항(정방향 + 역방향)의 평균. 4 이상은 높은 쪽, 2 이하는 낮은 쪽으로 기울었다고 본다. */
export function tendencyOf(trait: TraitId, answers: Record<string, number>): Tendency {
  const scored = LIKERT_ITEMS.filter((i) => i.trait === trait).map((i) => (i.keyed === "+" ? answers[i.id] : LIKERT_MAX + LIKERT_MIN - answers[i.id]));
  const mean = scored.reduce((a, b) => a + b, 0) / scored.length;
  const band: Band = mean >= 4 ? "high" : mean <= 2 ? "low" : "middle";
  return {
    trait,
    mean,
    band,
    lean: band === "middle" ? "상황에 따라 달라지는 편" : TRAITS[trait].lean[band],
    strong: Math.abs(mean - 3) >= 1.5,
  };
}

/**
 * 가치 순서: 남긴 단어 1·2·3순위에 3·2·1점, 내려놓은 단어에 0.5점.
 * 같은 점수면 더 높은 순위로 남긴 가치, 그다음 정의 순서. 그래서 1순위 단어의 가치가 항상 맨 앞에 온다.
 */
export function valueOrder(valuePicks: string[], kept: string[]): ValueId[] {
  const score = new Map<ValueId, number>();
  const bestRank = new Map<ValueId, number>();
  valuePicks.forEach((id) => {
    const v = VALUE_WORD_BY_ID.get(id)!.value;
    const rank = kept.indexOf(id);
    score.set(v, (score.get(v) ?? 0) + (rank === -1 ? 0.5 : 3 - rank));
    if (rank !== -1) bestRank.set(v, Math.min(bestRank.get(v) ?? 99, rank));
  });
  return [...score.keys()].sort(
    (a, b) => score.get(b)! - score.get(a)! || (bestRank.get(a) ?? 99) - (bestRank.get(b) ?? 99) || VALUE_IDS.indexOf(a) - VALUE_IDS.indexOf(b),
  );
}

const label = (id: ValueId) => VALUES[id].label;
const labels = (ids: ValueId[]) => ids.map(label).join(", ");

/** 데이터끼리의 연결 중 눈여겨볼 것을 규칙으로 찾는다. 최대 4개. */
export function findPatterns(kept: KeptWord[], letGo: { word: string; valueId: ValueId }[], grow: ValueId[]): string[] {
  const out: string[] = [];
  const keptValues = kept.map((k) => k.valueId);

  const counts = new Map<ValueId, number>();
  keptValues.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
  for (const [v, n] of counts) {
    if (n >= 2) out.push(`끝까지 남긴 세 단어 중 ${n}개가 같은 가치(${label(v)})예요. 이 가치가 특히 크게 자리 잡고 있을 수 있어요.`);
  }

  const distinct = [...new Set(keptValues)];
  for (const [a, b] of CONFLICT_PAIRS) {
    if (distinct.includes(a) && distinct.includes(b)) {
      out.push(`남긴 가치 중 ${josa(label(a), "와/과")} ${josa(label(b), "은/는")} 서로 반대 방향을 당기는 가치예요. 두 마음 사이에서 균형을 잡고 있을 수 있어요.`);
    }
  }

  const growIn = grow.filter((v) => keptValues.includes(v));
  const growOut = grow.filter((v) => !keptValues.includes(v));
  if (growOut.length > 0) {
    out.push(`더 키우고 싶은 힘(${labels(growOut)})은 끝까지 남긴 가치에 없어요. 지금 지키는 것과 바라는 방향 사이에 거리가 있을 수 있어요.`);
  }
  if (growIn.length > 0) {
    out.push(`더 키우고 싶은 힘(${labels(growIn)})은 이미 끝까지 남긴 가치이기도 해요. 소중하지만 아직 충분히 누리지 못한다고 느낄 수 있어요.`);
  }

  const backAgain = letGo.filter((l) => grow.includes(l.valueId));
  if (backAgain.length > 0) {
    out.push(`마지막에 내려놓은 '${backAgain[0].word}'의 가치(${label(backAgain[0].valueId)})를 더 키우고 싶은 힘으로 다시 골랐어요.`);
  }
  return out.slice(0, 4);
}

export function analyze(input: TestInput): Analysis {
  check(input);

  const tendencies = TRAIT_ORDER.map((t) => tendencyOf(t, input.answers));
  const highlights = tendencies
    .filter((t) => t.band !== "middle")
    .sort((a, b) => Math.abs(b.mean - 3) - Math.abs(a.mean - 3) || TRAIT_ORDER.indexOf(a.trait) - TRAIT_ORDER.indexOf(b.trait))
    .slice(0, 2);

  const kept: KeptWord[] = input.picks.narrow.map((id, i) => ({ rank: i + 1, wordId: id, word: wordText(id), valueId: VALUE_WORD_BY_ID.get(id)!.value }));
  const letGo = input.picks.values.filter((id) => !input.picks.narrow.includes(id)).map((id) => ({ word: wordText(id), valueId: VALUE_WORD_BY_ID.get(id)!.value }));
  const grow = input.picks.grow as ValueId[];
  const cardValue = kept[0].valueId;

  const slowestStep = [...STEPS].sort((a, b) => input.logs[b.id].durationMs - input.logs[a.id].durationMs)[0];

  return {
    takenOn: input.takenOn,
    card: { valueId: cardValue, ...RESULT_CARDS[cardValue] },
    personality: { tendencies, highlights },
    values: {
      picked: input.picks.values.map((id) => ({ word: wordText(id), valueId: VALUE_WORD_BY_ID.get(id)!.value })),
      kept,
      letGo,
      order: valueOrder(input.picks.values, input.picks.narrow),
    },
    now: input.picks.now.map(wordText),
    grow,
    patterns: findPatterns(kept, letGo, grow),
    hesitation: {
      slowest: { stepId: slowestStep.id, title: slowestStep.title, seconds: Math.max(1, Math.round(input.logs[slowestStep.id].durationMs / 1000)) },
      removed: PICK_STEPS.map((s) => ({
        stepId: s.id,
        words: input.logs[s.id].removed
          .filter((id) => !input.picks[s.id as PickStepId].includes(id))
          .map((id) => (s.id === "grow" ? VALUES[id as ValueId].label : wordText(id))),
      })).filter((r) => r.words.length > 0),
    },
  };
}

export function stepTitle(id: StepId): string {
  return stepById(id).title;
}

/** 로컬 날짜 YYYY-MM-DD */
export function localDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
