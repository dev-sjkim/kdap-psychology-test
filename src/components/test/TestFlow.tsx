"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LIKERT_ITEMS } from "@/data/likert";
import { FieldsBand, Notebook } from "@/components/Notebook";
import { ProgressBand } from "@/components/ProgressBand";
import type { PickStepId } from "@/lib/analysis/analyze";
import { STEP_INDEX, STEPS, type StepDef, type StepId } from "@/lib/steps";
import { firstIncompleteStep, isStepComplete, testStore, useHydrated, useTestState } from "@/lib/state/test-store";
import { useVisibleTimer } from "@/lib/state/use-visible-timer";
import { LikertQuestion } from "./LikertQuestion";
import { WordStep } from "./WordStep";

export const stepPath = (id: StepId) => `/test/${id}`;

/** 2~5단계 바닥: [다음] 하나. 뒤로 가기는 맨 위 화살표가 맡는다. 최소 개수를 채워야 넘어가고, 머문 시간을 기록한다. */
function StepFoot({ step }: { step: StepDef }) {
  const router = useRouter();
  const picked = useTestState().picks[step.id as PickStepId];
  const getVisibleMs = useVisibleTimer(step.id);
  const remaining = step.min - picked.length;
  const index = STEP_INDEX[step.id];
  const isLast = index === STEPS.length - 1;

  if (remaining > 0) {
    return (
      <button type="button" className="btn btn-wait" aria-disabled="true">
        {picked.length === 0 && step.min === step.max ? `${step.min}개를 골라 주세요` : `${remaining}개 더 골라 주세요`}
      </button>
    );
  }

  const next = () => {
    testStore.addTime(step.id, getVisibleMs());
    if (isLast) {
      testStore.finish();
      router.push("/result");
    } else {
      router.push(stepPath(STEPS[index + 1].id));
    }
  };

  return (
    <button type="button" className="btn" onClick={next}>
      {isLast ? "결과 보기" : "다음"}
    </button>
  );
}

/** /test/<단계> 화면. 주소가 지금 단계를 정한다(D39). */
export function TestFlow({ stepId }: { stepId: StepId }) {
  const hydrated = useHydrated();
  const state = useTestState();
  const router = useRouter();
  const index = STEP_INDEX[stepId];
  const step = STEPS[index];

  // 시작 전이면 새로 시작하고, 앞 단계를 마치지 않았으면 아직 안 끝낸 첫 단계로 돌려보낸다.
  useEffect(() => {
    if (!hydrated) return;
    testStore.ensureStarted();
    const first = firstIncompleteStep(testStore.getState());
    if (first !== null && STEP_INDEX[first] < index) {
      router.replace(stepPath(first));
      return;
    }
    if (stepId === "narrow") testStore.prepareNarrow();
  }, [hydrated, index, stepId, router]);

  // 단계나 문항이 바뀔 때마다 맨 위에서 시작한다.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stepId, state.likertIndex]);

  if (!hydrated) return <Notebook band={<FieldsBand />}>{null}</Notebook>;

  const answered = LIKERT_ITEMS.filter((i) => state.answers[i.id] !== undefined).length;
  const fills = STEPS.map((s, i) => {
    if (i < index) return isStepComplete(state, s.id) ? 1 : 0;
    if (i > index) return 0;
    if (s.kind === "likert") return answered / LIKERT_ITEMS.length;
    return Math.min(1, state.picks[s.id as PickStepId].length / s.min) * 0.9;
  });

  const goBack = () => {
    if (step.kind === "likert" && state.likertIndex > 0) testStore.likertBack();
    else if (index === 0) router.push("/");
    else router.push(stepPath(STEPS[index - 1].id));
  };
  const atVeryStart = index === 0 && state.likertIndex === 0;

  const band = <ProgressBand fills={fills} current={index} onBack={goBack} backLabel={atVeryStart ? "처음 화면으로" : "이전으로"} />;

  if (step.kind === "likert") {
    return (
      <Notebook band={band}>
        <div className="enter" key={`likert-${state.likertIndex}`}>
          <LikertQuestion index={state.likertIndex} onDone={() => router.push(stepPath(STEPS[1].id))} />
        </div>
      </Notebook>
    );
  }

  return (
    <Notebook band={band} foot={<StepFoot key={step.id} step={step} />}>
      <div className="enter" key={step.id}>
        <WordStep step={step} />
      </div>
    </Notebook>
  );
}
