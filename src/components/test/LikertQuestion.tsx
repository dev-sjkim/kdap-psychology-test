"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LIKERT_ITEMS, LIKERT_LABELS, LIKERT_MIN } from "@/data/likert";
import { HandLoop } from "@/components/HandLoop";
import { STEPS } from "@/lib/steps";
import { testStore, useTestState } from "@/lib/state/test-store";
import { useVisibleTimer } from "@/lib/state/use-visible-timer";

/** 답을 고른 뒤 동그라미가 그려지는 걸 보여 주고 넘어가기까지의 시간 */
const ADVANCE_DELAY_MS = 280;

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path d={dir === "left" ? "M15 5 L8 12 L15 19" : "M9 5 L16 12 L9 19"} />
  </svg>
);

/**
 * 1단계 "평소의 나": 한 화면에 한 문항, 5지선다. 고르면 자동으로 다음 문항으로 넘어간다.
 * 문항 번호 양옆의 ‹ › 로 답한 문항 사이를 오간다(D40). 첫 문항의 ‹는 처음 화면으로 간다(D45). › 는 답하기 전에는 비활성으로 두어 자리가 흔들리지 않게 한다.
 */
export function LikertQuestion({ index, onHome, onDone }: { index: number; onHome: () => void; onDone: () => void }) {
  const item = LIKERT_ITEMS[index];
  const saved = useTestState().answers[item.id];
  const [pending, setPending] = useState<number | null>(null);
  const getVisibleMs = useVisibleTimer(item.id);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const choose = useCallback(
    (value: number) => {
      // 넘어가는 동안 한 번 더 눌러 다음 문항을 건너뛰는 일을 막는다.
      if (pending !== null) return;
      setPending(value);
      const ms = getVisibleMs();
      timer.current = window.setTimeout(() => {
        if (testStore.answer(item.id, value, ms)) onDone();
      }, ADVANCE_DELAY_MS);
    },
    [pending, getVisibleMs, item.id, onDone],
  );

  const goNext = () => {
    if (testStore.likertNext()) onDone();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= LIKERT_LABELS.length) {
        e.preventDefault();
        choose(LIKERT_MIN + n - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choose]);

  const shown = pending ?? saved;
  const canNext = saved !== undefined && pending === null;
  const labelId = `q-${item.id}`;

  return (
    <>
      <div className="q-head">
        <p className="step-label">
          1단계 / {STEPS.length} · {STEPS[0].title}
        </p>
        <div className="q-stepper">
        <button type="button" className="q-arrow" onClick={() => (index === 0 ? onHome() : testStore.likertBack())} aria-label={index === 0 ? "처음 화면으로" : "이전 문항"}>
          <Chevron dir="left" />
        </button>
        <span className="q-count num">
          <b>{index + 1}</b> / {LIKERT_ITEMS.length}
        </span>
        <button type="button" className="q-arrow" onClick={goNext} disabled={!canNext} aria-label="다음 문항">
          <Chevron dir="right" />
        </button>
        </div>
      </div>
      <p className="q-text" id={labelId}>
        {item.text}
      </p>
      <div className="options" role="radiogroup" aria-labelledby={labelId}>
        {LIKERT_LABELS.map((label, i) => {
          const value = LIKERT_MIN + i;
          const checked = shown === value;
          return (
            <button key={value} type="button" role="radio" aria-checked={checked} className="opt" onClick={() => choose(value)}>
              <span className="opt-n num" aria-hidden="true">
                {i + 1}
              </span>
              <span className="opt-label">
                {label}
                {checked && <HandLoop variant="wide" />}
              </span>
            </button>
          );
        })}
      </div>
      <p className="q-hint">{index === 0 ? STEPS[0].prompt : "\u00a0"}</p>
      <p className="sr-only-live" aria-live="polite">
        {LIKERT_ITEMS.length}문항 중 {index + 1}번째
      </p>
    </>
  );
}
