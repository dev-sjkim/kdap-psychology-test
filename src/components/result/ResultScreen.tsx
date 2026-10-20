"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FieldsBand, Notebook } from "@/components/Notebook";
import { formatCount } from "@/lib/text/format";
import { buildCopyPrompt } from "@/lib/prompt/build-copy-prompt";
import { useHydrated, useTestState } from "@/lib/state/test-store";
import { AskAi } from "./AskAi";
import { ResultCard } from "./ResultCard";
import { ResultDetails } from "./ResultDetails";
import { RestartButton } from "./RestartButton";

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M6 9 L12 15 L18 9" />
    </svg>
  );
}

/** 결과를 정리하는 척 잠깐 보여 주는 화면의 길이 */
const THINKING_MS = 900;

/** 결과 머리줄: No.에 이 결과의 일련번호(올린 뒤의 전체 검사 횟수, D67). 못 올렸으면 빈 밑줄. */
function ResultBand({ day, no }: { day?: string; no?: number | null }) {
  const hand = no != null ? <span className="enter" aria-label={`${formatCount(no)}번째 결과`}>{formatCount(no)}</span> : null;
  return <FieldsBand day={day} no={hand} />;
}

export function ResultScreen() {
  const hydrated = useHydrated();
  const { analysis, completionNo } = useTestState();
  const [thinking, setThinking] = useState(true);
  const [details, setDetails] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  // 자세히 보기(D70): 펼친 뒤(높이 애니메이션 0.4초) 상세 맨 위로 스크롤하고, 접으면 맨 위로 돌아가 카드만 남긴다.
  const smooth = (): ScrollBehavior => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
  const openDetails = () => {
    setDetails(true);
    window.setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: smooth(), block: "start" }), 420);
  };
  const closeDetails = () => {
    setDetails(false);
    window.scrollTo({ top: 0, behavior: smooth() });
  };

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
      band={<ResultBand day={analysis.takenOn} no={completionNo} />}
      foot={
        <>
          {/* 펼쳐진 동안 [접기]는 바닥 줄 위에 떠 있어 아래로 스크롤해도 늘 같은 자리에 있다(D70) */}
          {details && (
            <button type="button" className="details-toggle open fold" aria-expanded aria-controls="result-details" onClick={closeDetails}>
              <span>접기</span>
              <Chevron />
            </button>
          )}
          <div className="foot-row">
            <AskAi prompt={prompt} fileName={txtName} />
            <RestartButton />
          </div>
        </>
      }
    >
      <ResultCard analysis={analysis} />
      {!details && (
        <button type="button" className="details-toggle" aria-expanded={false} aria-controls="result-details" onClick={openDetails}>
          <span>자세히 보기</span>
          <Chevron />
        </button>
      )}
      <div id="result-details" ref={detailsRef} className={`details-wrap ${details ? "open" : ""}`} aria-hidden={!details}>
        <div>{details && <ResultDetails analysis={analysis} />}</div>
      </div>
    </Notebook>
  );
}
