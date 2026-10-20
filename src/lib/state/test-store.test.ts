import { beforeEach, describe, expect, it } from "vitest";
import { LIKERT_ITEMS } from "@/data/likert";
import type { PickStepId } from "@/lib/analysis/analyze";
import { __resetStoreForTest, firstIncompleteStep, testStore } from "./test-store";

beforeEach(() => __resetStoreForTest());

function pickFirst(stepId: PickStepId, n: number) {
  testStore.getState().order[stepId].slice(0, n).forEach((x) => testStore.toggle(stepId, x));
}

function answerAll() {
  return LIKERT_ITEMS.map((item) => testStore.answer(item.id, 3, 1_000));
}

describe("testStore", () => {
  it("문항 20개와 단어 고르기 4단계를 마치면 결과를 만든다", () => {
    testStore.start();
    const lasts = answerAll();
    expect(lasts.at(-1)).toBe(true); // 마지막 문항에서만 다음 단계로 갈 차례라고 알려 준다
    expect(lasts.slice(0, -1).every((x) => !x)).toBe(true);
    expect(firstIncompleteStep(testStore.getState())).toBe("values");
    pickFirst("values", 5);
    testStore.prepareNarrow();
    expect(testStore.getState().order.narrow).toEqual(testStore.getState().picks.values);
    pickFirst("narrow", 3);
    pickFirst("now", 2);
    pickFirst("grow", 1);
    expect(firstIncompleteStep(testStore.getState())).toBeNull();
    const a = testStore.finish(new Date(2026, 9, 20));
    expect(a.takenOn).toBe("2026-10-20");
  });

  it("문항 사이를 앞뒤로 오간다. 답하지 않은 문항에서는 다음으로 가지 않는다", () => {
    testStore.start();
    testStore.answer(LIKERT_ITEMS[0].id, 4, 2_000);
    expect(testStore.getState().likertIndex).toBe(1);
    expect(testStore.likertNext()).toBe(false);
    expect(testStore.getState().likertIndex).toBe(1);
    testStore.likertBack();
    expect(testStore.getState().likertIndex).toBe(0);
    testStore.likertNext();
    expect(testStore.getState().likertIndex).toBe(1);
    expect(testStore.getState().logs.personality).toMatchObject({ toggles: 1, durationMs: 2_000 });
  });

  it("시작하기는 늘 새로 시작하고, 테스트 주소로 바로 와도 시작 전이면 새로 시작한다", () => {
    testStore.ensureStarted();
    expect(testStore.getState().started).toBe(true);
    testStore.answer(LIKERT_ITEMS[0].id, 4, 0);
    testStore.ensureStarted(); // 이미 시작했으면 그대로
    expect(Object.keys(testStore.getState().answers)).toHaveLength(1);
    testStore.start(); // 시작하기는 처음부터
    expect(Object.keys(testStore.getState().answers)).toHaveLength(0);
  });

  it("최대 개수를 넘으면 고르지 않고, 골랐다가 뺀 단어를 기록하며, 끌리는 단어에서 빼면 남길 단어에서도 빠진다", () => {
    testStore.start();
    const ids = testStore.getState().order.values;
    ids.slice(0, 5).forEach((id) => expect(testStore.toggle("values", id)).toBe(true));
    expect(testStore.toggle("values", ids[5])).toBe(false);
    testStore.toggle("narrow", ids[1]);
    testStore.toggle("values", ids[1]);
    expect(testStore.getState().picks.narrow).toEqual([]);
    expect(testStore.getState().logs.values.removed).toEqual([ids[1]]);
  });
});
