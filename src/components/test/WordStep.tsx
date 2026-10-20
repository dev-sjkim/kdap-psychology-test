"use client";

import { useState } from "react";
import { VALUES, type ValueId } from "@/data/values";
import { wordText } from "@/data/words";
import { HandLoop } from "@/components/HandLoop";
import type { PickStepId } from "@/lib/analysis/analyze";
import { STEPS, type StepDef } from "@/lib/steps";
import { testStore, useTestState } from "@/lib/state/test-store";

/** 한 단계 화면: 제목, 안내, 고른 개수, 단어(또는 가치 카드) 목록 */
export function WordStep({ step }: { step: StepDef }) {
  const state = useTestState();
  const stepId = step.id as PickStepId;
  const picked = state.picks[stepId];
  const options = state.order[stepId];
  const full = picked.length >= step.max;
  const [nope, setNope] = useState<string | null>(null);

  const toggle = (id: string) => {
    if (!testStore.toggle(stepId, id)) {
      // 이미 다 골랐는데 또 누르면 살짝 흔들어서 알려 준다.
      setNope(id);
      window.setTimeout(() => setNope(null), 480);
    }
  };

  const number = STEPS.indexOf(step) + 1;

  return (
    <>
      <p className="step-label">
        {number}단계 / {STEPS.length}
      </p>
      <h1 className="step-title">{step.title}</h1>
      <p className="step-prompt">{step.prompt}</p>
      <p className={`picked ${nope ? "nope" : ""}`} aria-live="polite">
        {nope ? (
          <>최대 {step.max}개까지 고를 수 있어요. 하나를 빼고 골라 주세요</>
        ) : (
          <>
            <b className="num" key={picked.length}>
              {picked.length}
            </b>
            / {step.max} 골랐어요
          </>
        )}
      </p>

      {step.id === "grow" ? (
        <div className="cards">
          {options.map((id) => {
            const v = VALUES[id as ValueId];
            const on = picked.includes(id);
            return (
              <button
                key={id}
                type="button"
                className={`vcard ${nope === id ? "nope" : ""}`}
                aria-pressed={on}
                aria-disabled={full && !on}
                onClick={() => toggle(id)}
              >
                <span className={`vname pencil v-${v.group}`}>{v.label}</span>
                <span className="vdesc">{v.cardDesc}</span>
                {on && <HandLoop variant="box" />}
              </button>
            );
          })}
        </div>
      ) : (
        <div className={`chips chips-${step.id}`}>
          {options.map((id) => {
            const on = picked.includes(id);
            const rank = step.ordered && on ? picked.indexOf(id) + 1 : null;
            return (
              <button
                key={id}
                type="button"
                className={`chip ${step.ordered ? "chip-lg" : ""} ${nope === id ? "nope" : ""}`}
                aria-pressed={on}
                aria-disabled={full && !on}
                aria-label={rank ? `${wordText(id)}, ${rank}순위` : undefined}
                onClick={() => toggle(id)}
              >
                {wordText(id)}
                {on && <HandLoop variant="wide" />}
                {rank && (
                  <span className="rank" aria-hidden="true">
                    {rank}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
