// 테스트 진행 상태 저장소. 페이지 바깥에 두고 sessionStorage에 동기화한다.
// 지금 어느 단계인지는 주소(/test/<단계>)가 정하고(D39), 여기에는 응답과 기록만 둔다.
// Cache Components가 켜져 있으면 다른 화면으로 가도 이전 화면의 상태가 숨겨진 채 남는다(D16).
// 그래서 진행 상태는 화면 컴포넌트가 아니라 여기 한 곳에서만 든다.

import { useSyncExternalStore } from "react";
import { LIKERT_ITEMS } from "@/data/likert";
import { VALUE_IDS } from "@/data/values";
import { NOW_WORDS, RELEASE_WORDS, VALUE_WORDS } from "@/data/words";
import { STORAGE_PREFIX } from "@/lib/app-info";
import { analyze, localDate, type Analysis, type PickStepId, type StepLog } from "@/lib/analysis/analyze";
import { recordCompletion } from "@/lib/stats/supabase";
import { STEPS, stepById, type StepId } from "@/lib/steps";

export interface TestState {
  v: 5;
  started: boolean;
  /** 1단계에서 지금 보고 있는 문항 번호(0부터) */
  likertIndex: number;
  answers: Record<string, number>;
  picks: Record<PickStepId, string[]>;
  logs: Record<StepId, StepLog>;
  /** 단계마다 사람마다 섞은 단어 순서 */
  order: Record<PickStepId, string[]>;
  analysis: Analysis | null;
  /** 이 결과의 일련번호 = 올린 뒤의 전체 검사 횟수(D67). 못 올렸으면 null */
  completionNo: number | null;
}

const STORAGE_KEY = `${STORAGE_PREFIX}:test:v5`;

function emptyState(): TestState {
  return {
    v: 5,
    started: false,
    likertIndex: 0,
    answers: {},
    picks: { values: [], narrow: [], now: [], release: [], grow: [] },
    logs: Object.fromEntries(STEPS.map((s): [StepId, StepLog] => [s.id, { toggles: 0, durationMs: 0, removed: [] }])) as Record<StepId, StepLog>,
    order: { values: VALUE_WORDS.map((w) => w.id), narrow: [], now: NOW_WORDS.map((w) => w.id), release: RELEASE_WORDS.map((w) => w.id), grow: [...VALUE_IDS] },
    analysis: null,
    completionNo: null,
  };
}

const SERVER_STATE = emptyState();

function load(): TestState {
  if (typeof window === "undefined") return SERVER_STATE;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const data = JSON.parse(raw) as TestState;
    return data.v === 5 && data.picks?.release && data.order?.release && data.answers ? data : emptyState();
  } catch {
    return emptyState();
  }
}

let state: TestState = load();
const listeners = new Set<() => void>();

function set(next: TestState) {
  state = next;
  if (typeof window !== "undefined") {
    try {
      if (!state.started) window.sessionStorage.removeItem(STORAGE_KEY);
      else window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // 사생활 보호 모드 등에서 저장이 막혀도 화면은 그대로 동작한다.
    }
  }
  listeners.forEach((l) => l());
}

function shuffled<T>(xs: readonly T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function bumpLog(stepId: StepId, patch: (log: StepLog) => StepLog) {
  return { ...state.logs, [stepId]: patch(state.logs[stepId]) };
}

/** 단계를 다 마쳤는지 */
export function isStepComplete(s: TestState, stepId: StepId): boolean {
  if (stepId === "personality") return LIKERT_ITEMS.every((i) => s.answers[i.id] !== undefined);
  return s.picks[stepId].length >= stepById(stepId).min;
}

/** 아직 마치지 않은 첫 단계. 모두 마쳤으면 null */
export function firstIncompleteStep(s: TestState): StepId | null {
  return STEPS.find((step) => !isStepComplete(s, step.id))?.id ?? null;
}

export const testStore = {
  getState: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /** 메인 화면의 [시작하기]: 늘 새로 시작한다(D39). */
  start() {
    const base = emptyState();
    set({ ...base, started: true, order: { ...base.order, values: shuffled(base.order.values), release: shuffled(base.order.release), grow: shuffled(base.order.grow) } });
  },

  /** 테스트 주소로 바로 들어왔는데 시작 전이면 새로 시작한다. */
  ensureStarted() {
    if (!state.started) testStore.start();
  },

  reset() {
    set(emptyState());
  },

  /** "끝까지 남길 단어"에 들어갈 때, 앞 단계에서 고른 다섯 개를 고른 순서 그대로 보여 준다. */
  prepareNarrow() {
    const same = state.order.narrow.length === state.picks.values.length && state.order.narrow.every((id, i) => id === state.picks.values[i]);
    if (!same) set({ ...state, order: { ...state.order, narrow: [...state.picks.values] } });
  },

  likertBack() {
    if (state.likertIndex > 0) set({ ...state, likertIndex: state.likertIndex - 1 });
  },

  /** 이미 답한 문항이면 다음 문항으로. 마지막 문항이면 true를 돌려준다(다음 단계로 갈 차례). */
  likertNext(): boolean {
    const item = LIKERT_ITEMS[state.likertIndex];
    if (state.answers[item.id] === undefined) return false;
    if (state.likertIndex < LIKERT_ITEMS.length - 1) {
      set({ ...state, likertIndex: state.likertIndex + 1 });
      return false;
    }
    return true;
  },

  /** 1단계 응답. 마지막 문항이 아니면 다음 문항으로 넘어가고, 마지막이면 true를 돌려준다. */
  answer(itemId: string, value: number, visibleMs: number): boolean {
    const index = LIKERT_ITEMS.findIndex((i) => i.id === itemId);
    const last = index === LIKERT_ITEMS.length - 1;
    set({
      ...state,
      answers: { ...state.answers, [itemId]: value },
      likertIndex: last ? index : index + 1,
      logs: bumpLog("personality", (l) => ({ ...l, toggles: l.toggles + 1, durationMs: l.durationMs + Math.min(Math.max(0, Math.round(visibleMs)), 60_000) })),
    });
    return last;
  },

  toggle(stepId: PickStepId, id: string) {
    const step = stepById(stepId);
    const picked = state.picks[stepId];
    const has = picked.includes(id);
    if (!has && picked.length >= step.max) return false;
    const picks = { ...state.picks, [stepId]: has ? picked.filter((x) => x !== id) : [...picked, id] };
    // 끌리는 단어에서 뺀 단어는 "끝까지 남길 단어"에서도 뺀다.
    if (stepId === "values" && has) picks.narrow = picks.narrow.filter((x) => x !== id);
    set({
      ...state,
      picks,
      logs: bumpLog(stepId, (l) => ({ ...l, toggles: l.toggles + 1, removed: has && !l.removed.includes(id) ? [...l.removed, id] : l.removed })),
    });
    return true;
  },

  addTime(stepId: StepId, ms: number) {
    set({ ...state, logs: bumpLog(stepId, (l) => ({ ...l, durationMs: l.durationMs + Math.max(0, Math.round(ms)) })) });
  },

  finish(now = new Date()): Analysis {
    const analysis = analyze({ answers: state.answers, picks: state.picks, logs: state.logs, takenOn: localDate(now) });
    set({ ...state, analysis, completionNo: null });
    // 전체 검사 횟수만 1 올린다(D61). 응답은 보내지 않는다. 돌아온 번호는 결과 화면 No. 칸에 적는다(D67).
    void recordCompletion().then((no) => {
      if (no !== null && state.analysis === analysis) set({ ...state, completionNo: no });
    });
    return analysis;
  },
};

export function useTestState(): TestState {
  return useSyncExternalStore(testStore.subscribe, testStore.getState, () => SERVER_STATE);
}

const noopSubscribe = () => () => {};

/** 브라우저에서 저장소를 읽을 수 있게 된 뒤에만 true. 서버 렌더와 첫 화면의 깜빡임을 막는다. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/** 테스트 전용: 저장소를 빈 상태로 되돌린다. */
export function __resetStoreForTest() {
  state = emptyState();
}
