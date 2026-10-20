"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Notebook } from "@/components/Notebook";
import { HandDate } from "@/components/HandDate";
import { SoundToggle } from "@/components/SoundToggle";
import { buildCopyPrompt } from "@/lib/prompt/build-copy-prompt";
import { useHydrated, useTestState } from "@/lib/state/test-store";
import { AskAi } from "./AskAi";
import { ResultCard } from "./ResultCard";
import { ResultDetails } from "./ResultDetails";
import { RestartButton } from "./RestartButton";

/** 결과를 정리하는 척 잠깐 보여 주는 화면의 길이 */
const THINKING_MS = 900;

function ResultBand({ day }: { day?: string }) {
  return (
    <div className="band band-result">
      <Link className="brand" href="/">
        마음결
      </Link>
      <span className="field-right">
        {day && (
          <span className="field">
            <span aria-hidden="true">Date.</span>
            <HandDate day={day} />
          </span>
        )}
        <SoundToggle />
      </span>
    </div>
  );
}

export function ResultScreen() {
  const hydrated = useHydrated();
  const { analysis } = useTestState();
  const [thinking, setThinking] = useState(true);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setThinking(false), THINKING_MS);
    return () => window.clearTimeout(id);
  }, []);

  const prompt = useMemo(() => (analysis ? buildCopyPrompt(analysis) : ""), [analysis]);

  if (!hydrated) return <Notebook band={<ResultBand />}>{null}</Notebook>;

  if (!analysis) {
    return (
      <Notebook
        band={<ResultBand />}
        foot={
          <Link className="btn" href="/">
            테스트하러 가기
          </Link>
        }
      >
        <div className="enter">
          <h1 className="step-title" style={{ marginTop: 28 }}>
            아직 결과가 없어요
          </h1>
          <p className="step-prompt">테스트를 끝내면 여기에 결과 카드가 나와요. 결과는 따로 저장되지 않아요.</p>
        </div>
      </Notebook>
    );
  }

  if (thinking) {
    return (
      <Notebook band={<ResultBand />}>
        <div className="thinking" role="status">
          <svg viewBox="0 0 140 40" width="140" height="40" aria-hidden="true">
            <path d="M6 28 C 18 8, 26 34, 38 20 S 58 10, 66 26 S 88 34, 96 16 S 122 14, 134 24" />
          </svg>
          고른 단어를 정리하고 있어요
        </div>
      </Notebook>
    );
  }

  const txtName = `maeumgyeol-${analysis.takenOn}.txt`;

  return (
    <Notebook
      band={<ResultBand day={analysis.takenOn} />}
      foot={
        <div className="foot-row">
          <AskAi prompt={prompt} fileName={txtName} />
          <RestartButton />
        </div>
      }
    >
      <ResultCard analysis={analysis} />
      <button type="button" className={`details-toggle ${details ? "open" : ""}`} aria-expanded={details} aria-controls="result-details" onClick={() => setDetails((d) => !d)}>
        <span>{details ? "접기" : "자세히 보기"}</span>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M6 9 L12 15 L18 9" />
        </svg>
      </button>
      <div id="result-details" className={`details-wrap ${details ? "open" : ""}`} aria-hidden={!details}>
        <div>{details && <ResultDetails analysis={analysis} />}</div>
      </div>
      <p className="footnote">결과는 따로 저장되지 않아요. 복사한 글을 나중에 다시 쓰고 싶으면 메모장에 붙여 두세요.</p>
    </Notebook>
  );
}
