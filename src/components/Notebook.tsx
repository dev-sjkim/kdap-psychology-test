"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { HandDate } from "./HandDate";
import { SoundToggle } from "./SoundToggle";

interface Props {
  band: ReactNode;
  foot?: ReactNode;
  children: ReactNode;
}

/**
 * 노트 속지 한 장: 맨 위 인쇄 칸(band), 괘선 본문, 바닥 고정 버튼 영역(foot).
 * 배경음 버튼은 모든 화면에서 오른쪽 아래 엄지 영역에 띄운다(D53). 바닥 버튼 높이를 재서 그 위로 올린다.
 */
export function Notebook({ band, foot, children }: Props) {
  const footRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = footRef.current;
    const root = rootRef.current;
    if (!root) return;
    if (!el) {
      root.style.setProperty("--foot-h", "0px");
      return;
    }
    const apply = () => root.style.setProperty("--foot-h", `${el.offsetHeight}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [foot]);

  return (
    <div className="notebook" ref={rootRef}>
      {band}
      <SoundToggle />
      <main className="notebook-content">{children}</main>
      {foot && (
        <div className="foot" ref={footRef}>
          {foot}
        </div>
      )}
    </div>
  );
}

/** 노트 인쇄 칸: 왼쪽 "No. ____", 오른쪽 끝 "Date. (손글씨 날짜)" + 선택 요소(메인 화면의 ? 버튼)(D48, D54) */
export function FieldsBand({ day, extra }: { day?: string; extra?: ReactNode }) {
  return (
    <div className="band band-fields">
      <span className="field" aria-hidden="true">
        No.<span className="blank" />
      </span>
      <span className="field-right">
        <span className="field">
          <span aria-hidden="true">Date.</span>
          <HandDate day={day} />
        </span>
        {extra}
      </span>
    </div>
  );
}
