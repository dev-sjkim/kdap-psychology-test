"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CREDITS, THANKS } from "@/data/credits";
import { REFERENCES } from "@/data/references";

type Tab = "about" | "maker";

/**
 * 메인 화면 맨 위 줄의 "?" 버튼 → "마음결에 대해" 모달(D43, D54, D56, D60).
 * 노트 인덱스 탭 두 장([마음결] [만든 사람])이 모달 안쪽 머리줄에 붙어 있다. 고른 탭이 종이색이 된다.
 * 크레딧은 만든 사람 카드 맨 아래 각주 한 줄로 늘 보인다. 모달은 document.body에 portal로 그린다.
 */
export function BasisDialog() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("about");
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
    setTab("about");
    triggerRef.current?.focus();
  };

  return (
    <>
      <button ref={triggerRef} type="button" className="about-btn" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label="마음결에 대해" title="마음결에 대해">
        <span aria-hidden="true">?</span>
      </button>
      {open &&
        createPortal(
          <div className="modal-scrim" onClick={close}>
            <div className="modal about tabbed" role="dialog" aria-modal="true" aria-labelledby="about-title" onClick={(e) => e.stopPropagation()}>
              <div className="index-tabs" role="tablist" aria-label="마음결에 대해">
                <button type="button" role="tab" id="tab-about" aria-selected={tab === "about"} aria-controls="panel-about" className={tab === "about" ? "on" : ""} onClick={() => setTab("about")}>
                  마음결
                </button>
                <button type="button" role="tab" id="tab-maker" aria-selected={tab === "maker"} aria-controls="panel-maker" className={tab === "maker" ? "on" : ""} onClick={() => setTab("maker")}>
                  만든 사람
                </button>
              </div>

              {tab === "about" ? (
                <div className="tab-panel enter" id="panel-about" role="tabpanel" aria-labelledby="tab-about">
                  <h2 id="about-title" ref={titleRef} tabIndex={-1}>
                    마음결은 무엇인가요
                  </h2>
                  <p>
                    마음결은 타고난 결(성격)과 지키려는 것(가치)이 어디서 맞물리고 어디서 엇갈리는지 4분 만에 들여다보는 자기 이해 테스트예요. 결과는 나를 그린 카드 한 장과, 평소 쓰는 AI에 붙여 넣어 깊은 해석을 받는 글로 돌려드려요.
                  </p>
                  <ul>
                    <li>성격: Big Five 검사 Mini-IPIP(Donnellan 외, 2006) 20문항</li>
                    <li>가치: Schwartz 기본가치 10가지(1992, 2012)를 담은 단어 40개</li>
                    <li>고르고 덜어내기: Personal Values Card Sort(Miller 외, 2001)에서 빌린 방식</li>
                  </ul>
                  <p className="refs">
                    한국어판 검증과 규준이 없어 검증된 검사나 진단은 아니에요. 점수를 매기기보다 어느 쪽으로 기울었는지 가볍게 살펴봐요. 답한 내용은 이 브라우저 안에서만 정리하고 어디에도 보내지 않아요.
                  </p>
                  <p className="refs">참고: {REFERENCES.map((r) => r.short).join(" · ")}</p>
                </div>
              ) : (
                <div className="maker-card enter" id="panel-maker" role="tabpanel" aria-labelledby="tab-maker">
                  <p className="maker-kicker">만든 사람</p>
                  <h2 id="about-title" ref={titleRef} tabIndex={-1} className="maker-name">
                    {CREDITS.maker}
                  </h2>
                  <p className="maker-bio">{CREDITS.bio}</p>
                  <p className="maker-contact">
                    <span className="field-label">Contact.</span>
                    <a href={CREDITS.contactHref} className="selectable">
                      {CREDITS.contactLabel}
                    </a>
                  </p>
                  <p className="thanks">{THANKS}</p>
                </div>
              )}

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
