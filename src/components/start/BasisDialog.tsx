"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CREDITS, OPEN_SOURCE_CREDITS } from "@/data/credits";
import { REFERENCES } from "@/data/references";

/**
 * 메인 화면 맨 위 줄의 "?" 버튼 → "이 테스트에 대해" 모달(D43, D54).
 * 두 부분: ① 어떻게 만들었나(근거와 한계) ② 만든 사람과 크레딧.
 * 모달은 document.body에 portal로 그린다(등장 애니메이션의 transform 안에서는 fixed가 화면 기준이 아니게 되므로).
 */
export function BasisDialog() {
  const [open, setOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    titleRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const hasMaker = CREDITS.maker.trim().length > 0;

  return (
    <>
      <button ref={triggerRef} type="button" className="about-btn" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label="이 테스트에 대해" title="이 테스트에 대해">
        <span aria-hidden="true">?</span>
      </button>
      {open &&
        createPortal(
          <div className="modal-scrim" onClick={close}>
            <div className="modal about" role="dialog" aria-modal="true" aria-labelledby="about-title" onClick={(e) => e.stopPropagation()}>
              <h2 id="about-title" ref={titleRef} tabIndex={-1}>
                이 테스트에 대해
              </h2>

              <h3>어떻게 만들었나요</h3>
              <ul>
                <li>평소의 나: Big Five 성격 검사 Mini-IPIP(Donnellan 외, 2006) 20문항을 썼어요.</li>
                <li>가치 단어: Schwartz의 기본가치 10가지(1992, 2012)마다 단어 두 개씩을 골랐어요.</li>
                <li>고르고 덜어내는 방식: Personal Values Card Sort(Miller 외, 2001)에서 아이디어를 빌렸어요.</li>
              </ul>
              <p>한국어판 검증과 규준이 없어 검증된 검사는 아니에요. 점수를 매기기보다 어느 쪽으로 기울었는지 가볍게 살펴봐요. 답한 내용은 이 브라우저 안에서만 정리하고 어디에도 보내지 않아요.</p>
              <p className="refs">참고: {REFERENCES.map((r) => r.short).join(" · ")}</p>

              <h3>만든 사람</h3>
              {hasMaker ? (
                <p>
                  <b>{CREDITS.maker}</b>
                  {CREDITS.bio && <> · {CREDITS.bio}</>}
                </p>
              ) : (
                <p className="refs">만든 사람 정보는 곧 채울 예정이에요.</p>
              )}
              {CREDITS.context && <p className="refs">{CREDITS.context}</p>}
              {CREDITS.links.length > 0 && (
                <p className="about-links">
                  {CREDITS.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                      {l.label}
                    </a>
                  ))}
                </p>
              )}
              <ul className="refs-list">
                {OPEN_SOURCE_CREDITS.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>

              <button type="button" className="btn btn-quiet" onClick={close}>
                닫기
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
