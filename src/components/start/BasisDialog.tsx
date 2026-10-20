"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { REFERENCES } from "@/data/references";

/**
 * "어떤 근거로 만들었나요?" — 펼치기 대신 모달로 띄운다(D43).
 * 펼치면 문서 높이가 늘어 화면이 밀렸는데, 모달은 화면 위에 떠서 아래 내용이 움직이지 않는다.
 * 등장 애니메이션(transform)이 걸린 요소 안에서는 position: fixed가 화면 기준이 아니게 되므로 body에 portal로 그린다.
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

  return (
    <>
      <button ref={triggerRef} type="button" className="basis-link" onClick={() => setOpen(true)} aria-haspopup="dialog">
        어떤 근거로 만들었나요?
      </button>
      {open &&
        createPortal(
        <div className="modal-scrim" onClick={close}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="basis-title" onClick={(e) => e.stopPropagation()}>
            <h2 id="basis-title" ref={titleRef} tabIndex={-1}>
              어떤 근거로 만들었나요?
            </h2>
            <ul>
              <li>평소의 나: Big Five 성격 검사 Mini-IPIP(Donnellan 외, 2006)의 20문항 중 10문항을 골라 썼어요.</li>
              <li>가치 단어: Schwartz의 기본가치 10가지(1992, 2012)마다 단어 두 개씩을 골랐어요.</li>
              <li>고르고 덜어내는 방식: Personal Values Card Sort(Miller 외, 2001)에서 아이디어를 빌렸어요.</li>
            </ul>
            <p>짧게 줄인 문항과 앱이 고른 단어라 검증된 검사는 아니에요. 점수를 매기기보다 어느 쪽으로 기울었는지 가볍게 살펴봐요.</p>
            <p className="refs">참고: {REFERENCES.map((r) => r.short).join(" · ")}</p>
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
