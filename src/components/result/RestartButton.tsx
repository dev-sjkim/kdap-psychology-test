"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { testStore } from "@/lib/state/test-store";

/**
 * 결과 화면 바닥의 정사각형 다시하기 버튼(D62). 누르면 확인 모달이 뜨고, 모달의 [처음부터]를 눌러야 실행된다.
 * 결과는 저장되지 않으므로 잘못 눌러 잃지 않게 한다.
 */
export function RestartButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!open) return;
    titleRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const restart = () => {
    testStore.reset();
    router.push("/");
  };

  return (
    <>
      <button type="button" className="restart-sq" onClick={() => setOpen(true)} aria-label="처음부터 다시 하기" title="처음부터 다시 하기" aria-haspopup="dialog">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M5 12 A7 7 0 1 0 7.5 6.6 M5 4.5 V8.5 H9" />
        </svg>
      </button>
      {open &&
        createPortal(
          <div className="modal-scrim" onClick={() => setOpen(false)}>
            <div className="modal confirm" role="dialog" aria-modal="true" aria-labelledby="restart-title" onClick={(e) => e.stopPropagation()}>
              <h2 id="restart-title" ref={titleRef} tabIndex={-1}>
                처음부터 다시 할까요?
              </h2>
              <p>지금 결과는 저장되지 않아요. 아직 복사하지 않았다면 먼저 [AI에게 해석 받기]로 복사해 두세요.</p>
              <div className="modal-actions">
                <button type="button" className="btn btn-quiet" onClick={() => setOpen(false)}>
                  남아 있기
                </button>
                <button type="button" className="btn" onClick={restart}>
                  처음부터
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
