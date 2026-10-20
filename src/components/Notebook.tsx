import type { ReactNode } from "react";
import { HandDate } from "./HandDate";
import { SoundToggle } from "./SoundToggle";

interface Props {
  band: ReactNode;
  foot?: ReactNode;
  children: ReactNode;
}

/**
 * 노트 속지 한 장: 맨 위 인쇄 칸(band), 괘선 본문, 바닥 고정 버튼 영역(foot).
 * 배경음 버튼은 모든 화면에서 같은 자리, 왼쪽 여백 칸에 둔다(D42).
 */
export function Notebook({ band, foot, children }: Props) {
  return (
    <div className="notebook">
      {band}
      <SoundToggle />
      <main className="notebook-content">{children}</main>
      {foot && <div className="foot">{foot}</div>}
    </div>
  );
}

/** 노트 인쇄 칸: "No. ____   Date. (손글씨 날짜)" */
export function FieldsBand({ day }: { day?: string }) {
  return (
    <div className="band band-fields">
      <span className="field" aria-hidden="true">
        No.<span className="blank" />
      </span>
      <span className="field">
        <span aria-hidden="true">Date.</span>
        <HandDate day={day} />
      </span>
    </div>
  );
}
