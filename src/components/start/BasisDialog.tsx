"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CREDITS, LICENSE_NOTES } from "@/data/credits";
import { REFERENCES } from "@/data/references";

type Tab = "about" | "maker";

/**
 * 메인 화면 맨 위 줄의 "?" 버튼 → "이 테스트에 대해" 모달(D43, D54, D56).
 * 노트에 붙인 인덱스 탭 두 장처럼 생겼다: [이 테스트] [만든 사람]. 고른 탭이 종이 위로 올라온다.
 * 라이선스는 "라이선스 보기"를 눌렀을 때만 펼친다. 모달은 document.body에 portal로 그린다.
 */
export function BasisDialog() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("about");
  const [license, setLicense] = useState(false);
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
    setLicense(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <button ref={triggerRef} type="button" className="about-btn" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label="이 테스트에 대해" title="이 테스트에 대해">
        <span aria-hidden="true">?</span>
      </button>
      {open &&
        createPortal(
          <div className="modal-scrim" onClick={close}>
            <div className="modal about tabbed" role="dialog" aria-modal="true" aria-labelledby="about-title" onClick={(e) => e.stopPropagation()}>
              <div className="index-tabs" role="tablist" aria-label="이 테스트에 대해">
                <button type="button" role="tab" id="tab-about" aria-selected={tab === "about"} aria-controls="panel-about" className={tab === "about" ? "on" : ""} onClick={() => setTab("about")}>
                  이 테스트
                </button>
                <button type="button" role="tab" id="tab-maker" aria-selected={tab === "maker"} aria-controls="panel-maker" className={tab === "maker" ? "on" : ""} onClick={() => setTab("maker")}>
                  만든 사람
                </button>
              </div>

              {tab === "about" ? (
                <div className="tab-panel enter" id="panel-about" role="tabpanel" aria-labelledby="tab-about">
                  <h2 id="about-title" ref={titleRef} tabIndex={-1}>
                    어떻게 만들었나요
                  </h2>
                  <ul>
                    <li>평소의 나: Big Five 성격 검사 Mini-IPIP(Donnellan 외, 2006) 20문항을 썼어요.</li>
                    <li>가치 단어: Schwartz의 기본가치 10가지(1992, 2012)마다 단어 네 개씩을 골랐어요.</li>
                    <li>고르고 덜어내는 방식: Personal Values Card Sort(Miller 외, 2001)에서 아이디어를 빌렸어요.</li>
                  </ul>
                  <p>한국어판 검증과 규준이 없어 검증된 검사는 아니에요. 점수를 매기기보다 어느 쪽으로 기울었는지 가볍게 살펴봐요. 답한 내용은 이 브라우저 안에서만 정리하고 어디에도 보내지 않아요.</p>
                  <p className="refs">참고: {REFERENCES.map((r) => r.short).join(" · ")}</p>
                </div>
              ) : (
                <div className="tab-panel enter maker-card" id="panel-maker" role="tabpanel" aria-labelledby="tab-maker">
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
                  <button type="button" className="license-toggle" aria-expanded={license} onClick={() => setLicense((v) => !v)}>
                    {license ? "라이선스 접기" : "라이선스 보기"}
                  </button>
                  {license && (
                    <ul className="refs-list enter">
                      {LICENSE_NOTES.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  )}
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
