// 응답으로 결과를 만든다. 점수를 매기기보다 기울기와 눈여겨볼 연결을 정리하는 가벼운 규칙이다.
// 부수효과가 없는 순수 함수이며, 같은 입력이면 항상 같은 결과가 나온다.

import { LIKERT_ITEMS, LIKERT_MAX, LIKERT_MIN } from "@/data/likert";
import { RESULT_CARDS } from "@/data/result-cards";
import { CONFLICT_PAIRS, VALUE_IDS, VALUES, type ValueGroup, type ValueId } from "@/data/values";
import { NOW_WORDS, RELEASE_WORD_BY_ID, TRAIT_ORDER, TRAITS, VALUE_WORD_BY_ID, wordText, type TraitId } from "@/data/words";
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
  /** 네 문항 평균(1~5) */
  mean: number;
  /** 카드 그래프용 0~1 비율 ((mean − 1) / 4) */
  ratio: number;
  band: Band;
  /** 기운 쪽을 말로 */
  lean: string;
  strong: boolean;
}

export interface ClearAnswer {
  itemId: string;
  trait: TraitId;
  /** 1~5 */
  answer: number;
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
  /** clearAnswers: 가장 분명하게 답한 문항(해석 프롬프트의 행동 근거, D76) */
  personality: { tendencies: Tendency[]; highlights: Tendency[]; clearAnswers: ClearAnswer[] };
  values: {
    picked: { word: string; valueId: ValueId }[];
    kept: KeptWord[];
    letGo: { word: string; valueId: ValueId }[];
    order: ValueId[];
  };
  now: string[];
  /** 비워 내고 싶은 것(D57)과 그 자리에 들어설 가치 */
  release: { word: string; valueId: ValueId }[];
  grow: ValueId[];
  /** 카드 아래 한 줄로 보여 주는 가장 강한 연결(D55). 없으면 null */
  headline: string | null;
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
  for (const id of input.picks.narrow) if (!input.picks.values.includes(id)) throw new Error("남길 단어는 앞에서 고른 것 안에서 골라야 합니다.");
  for (const id of input.picks.now) if (!NOW_WORDS.some((w) => w.id === id)) throw new Error(`알 수 없는 기분 단어: ${id}`);
  for (const id of input.picks.release) if (!RELEASE_WORD_BY_ID.has(id)) throw new Error(`알 수 없는 비움 단어: ${id}`);
  for (const id of input.picks.grow) if (!VALUE_IDS.includes(id as ValueId)) throw new Error(`알 수 없는 가치: ${id}`);
}

/** 특성별 네 문항(역방향은 뒤집음)의 평균(1~5). 3.75 이상은 높은 쪽, 2.25 이하는 낮은 쪽으로 기울었다고 본다(D50). */
export function tendencyOf(trait: TraitId, answers: Record<string, number>): Tendency {
  const scored = LIKERT_ITEMS.filter((i) => i.trait === trait).map((i) => (i.keyed === "+" ? answers[i.id] : LIKERT_MAX + LIKERT_MIN - answers[i.id]));
  const mean = scored.reduce((a, b) => a + b, 0) / scored.length;
  const band: Band = mean >= 3.75 ? "high" : mean <= 2.25 ? "low" : "middle";
  return {
    trait,
    mean,
    ratio: (mean - 1) / 4,
    band,
    lean: band === "middle" ? "상황에 따라 달라지는 편" : TRAITS[trait].lean[band],
    strong: Math.abs(mean - 3) >= 1.25,
  };
}

/**
 * 가장 분명하게 답한 문항을 최대 max개 고른다(D76). "보통이에요"는 빼고, 양 끝(전혀·정말)을 먼저,
 * 같은 세기면 아직 고르지 않은 특성을, 그다음 원판 문항 순서로. 지어낸 장면 대신 실제 응답을 행동 근거로 쓰기 위해서다.
 */
export function pickClearAnswers(answers: Record<string, number>, max = 4): ClearAnswer[] {
  const candidates = LIKERT_ITEMS.map((i) => ({ itemId: i.id, trait: i.trait, answer: answers[i.id] })).filter((c) => c.answer !== 3);
  const strength = (c: ClearAnswer) => Math.abs(c.answer - 3);
  const out: ClearAnswer[] = [];
  while (out.length < max) {
    const used = new Set(out.map((c) => c.trait));
    const left = candidates.filter((c) => !out.includes(c));
    if (left.length === 0) break;
    const next = left.reduce((best, c) => {
      const d = strength(c) - strength(best) || Number(used.has(best.trait)) - Number(used.has(c.trait));
      return d > 0 ? c : best;
    });
    out.push(next);
  }
  return out;
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

/**
 * 기질 × 1순위 가치가 맞물리거나 엇갈리는 지점(D55). Schwartz 상위 차원과 Big Five의 흔한 짝으로 본다:
 * 개방성 ↔ 변화 개방 / 성실성 ↔ 보존 / 친화성 ↔ 자기초월 / 외향성 ↔ 자기고양. 즐거움(경계)은 짝이 없다.
 */
const TRAIT_GROUP_PAIRS: { trait: TraitId; group: ValueGroup; high: string; low: string }[] = [
  { trait: "openness", group: "openness", high: "새로운 생각을 즐기는", low: "현실적이고 실용적인" },
  { trait: "conscientiousness", group: "conservation", high: "미리 계획하고 챙기는", low: "흐름에 맡기고 유연한" },
  { trait: "agreeableness", group: "transcendence", high: "다른 사람 마음을 먼저 살피는", low: "할 말은 분명히 하는" },
  { trait: "extraversion", group: "enhancement", high: "사람들 속에서 힘이 나는", low: "혼자만의 시간에서 힘을 얻는" },
];

export function traitValueLink(tendencies: Tendency[], top: ValueId): string | null {
  const pair = TRAIT_GROUP_PAIRS.find((p) => p.group === VALUES[top].group);
  if (!pair) return null;
  const t = tendencies.find((x) => x.trait === pair.trait);
  if (!t || t.band === "middle") return null;
  const v = josa(label(top), "을/를");
  if (t.band === "high") return `${pair.high} 편이고, 1순위로 ${v} 남겼어요. 성격과 가치가 같은 쪽을 보고 있어요.`;
  return `${pair.low} 편인데, 1순위로 ${v} 남겼어요. 성격은 이쪽인데 지키고 싶은 건 저쪽이라, 둘 사이에서 애쓰는 때가 있을 거예요.`;
}

/** 데이터끼리의 연결 중 눈여겨볼 것을 규칙으로 찾는다. 첫 항목이 가장 강한 연결이다(카드의 headline). */
export function findPatterns(
  tendencies: Tendency[],
  kept: KeptWord[],
  letGo: { word: string; valueId: ValueId }[],
  release: { word: string; valueId: ValueId }[],
  grow: ValueId[],
): string[] {
  const out: string[] = [];
  const keptValues = kept.map((k) => k.valueId);

  const link = traitValueLink(tendencies, keptValues[0]);
  if (link) out.push(link);

  const counts = new Map<ValueId, number>();
  keptValues.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
  for (const [v, n] of counts) {
    if (n >= 2) out.push(`끝까지 남긴 세 단어 중 ${n}개가 ${label(v)} 쪽 단어예요. 지금 가장 크게 자리 잡은 가치예요.`);
  }

  const distinct = [...new Set(keptValues)];
  for (const [a, b] of CONFLICT_PAIRS) {
    if (distinct.includes(a) && distinct.includes(b)) {
      out.push(`남긴 가치 중 ${josa(label(a), "와/과")} ${josa(label(b), "은/는")} 서로 반대편에 있는 가치예요. 둘 다 놓기 싫어서 그 사이를 오가는 중일 수 있어요.`);
    }
  }

  for (const r of release) {
    const w = josa(`'${r.word}'`, "을/를");
    if (keptValues.includes(r.valueId)) {
      out.push(`${w} 내려놓고 싶다고 했는데, 그 자리에 들어설 ${josa(label(r.valueId), "은/는")} 끝까지 남긴 가치이기도 해요. 지키고 싶은 걸 지금 이게 가리고 있는 셈이에요.`);
    } else if (grow.includes(r.valueId)) {
      out.push(`${w} 내려놓으면 자리가 생기는 ${josa(label(r.valueId), "을/를")} 키우고 싶은 힘으로도 골랐어요. 비우려는 것과 키우려는 것이 같은 방향이에요.`);
    }
  }

  const growIn = grow.filter((v) => keptValues.includes(v));
  const growOut = grow.filter((v) => !keptValues.includes(v));
  if (growOut.length > 0) {
    out.push(`키우고 싶은 ${josa(labels(growOut), "은/는")} 끝까지 남긴 가치에는 없어요. 지금 지키는 것과 앞으로 바라는 것이 조금 다른 셈이에요.`);
  }
  if (growIn.length > 0) {
    out.push(`키우고 싶은 ${josa(labels(growIn), "은/는")} 끝까지 남긴 가치이기도 해요. 소중한데 아직 모자라다고 느끼는 쪽이에요.`);
  }

  const backAgain = letGo.filter((l) => grow.includes(l.valueId));
  if (backAgain.length > 0) {
    const { word, valueId } = backAgain[0];
    // 단어와 가치 이름이 같으면("영향력") 한 번만 쓴다
    out.push(
      word === label(valueId)
        ? `마지막에 내려놓은 ${josa(`'${word}'`, "을/를")} 키우고 싶은 힘으로 다시 골랐어요.`
        : `마지막에 내려놓은 ${josa(`'${word}'`, "와/과")} 같은 쪽인 ${josa(label(valueId), "을/를")} 키우고 싶은 힘으로 다시 골랐어요.`,
    );
  }
  return out.slice(0, 5);
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
  const release = input.picks.release.map((id) => ({ word: wordText(id), valueId: RELEASE_WORD_BY_ID.get(id)!.value }));
  const grow = input.picks.grow as ValueId[];
  const cardValue = kept[0].valueId;
  const patterns = findPatterns(tendencies, kept, letGo, release, grow);

  const slowestStep = [...STEPS].sort((a, b) => input.logs[b.id].durationMs - input.logs[a.id].durationMs)[0];

  return {
    takenOn: input.takenOn,
    card: { valueId: cardValue, ...RESULT_CARDS[cardValue] },
    personality: { tendencies, highlights, clearAnswers: pickClearAnswers(input.answers) },
    values: {
      picked: input.picks.values.map((id) => ({ word: wordText(id), valueId: VALUE_WORD_BY_ID.get(id)!.value })),
      kept,
      letGo,
      order: valueOrder(input.picks.values, input.picks.narrow),
    },
    now: input.picks.now.map(wordText),
    release,
    grow,
    headline: patterns[0] ?? null,
    patterns,
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
