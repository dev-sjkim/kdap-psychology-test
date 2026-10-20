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
 * 배경음 버튼은 모든 화면 맨 위 줄 오른쪽 끝에 둔다(D63). 바닥 버튼과 부딪히지 않고 자리가 늘 같다.
 */
export function Notebook({ band, foot, children }: Props) {
  return (
    <div className="notebook">
      {band}
      <main className="notebook-content">{children}</main>
      {foot && <div className="foot">{foot}</div>}
    </div>
  );
}

/**
 * 노트 인쇄 칸: 왼쪽 "No. ____", 오른쪽 끝 "Date. (손글씨 날짜)" + 선택 요소(메인 화면의 ? 버튼)(D48, D54).
 * No. 밑줄에는 일련번호를 손글씨로 적는다(D67): 메인은 지금까지 적힌 장 수, 결과는 이 결과의 번호. 없으면 빈 밑줄.
 */
export function FieldsBand({ day, no, extra }: { day?: string; no?: ReactNode; extra?: ReactNode }) {
  return (
    <div className="band band-fields">
      <span className="field">
        <span aria-hidden="true">No.</span>
        <span className="hand-date hand-no num">{no}</span>
      </span>
      <span className="field-right">
        <span className="field">
          <span aria-hidden="true">Date.</span>
          <HandDate day={day} />
        </span>
        {extra}
        <SoundToggle />
      </span>
    </div>
  );
}
