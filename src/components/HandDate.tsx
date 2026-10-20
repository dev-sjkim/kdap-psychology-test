"use client";

import { useHydrated } from "@/lib/state/test-store";
import { localDate } from "@/lib/analysis/analyze";

/** 노트 인쇄 칸 "Date." 옆에 손글씨로 적은 날짜. day가 없으면 오늘 날짜(브라우저 시간)를 쓴다. */
export function HandDate({ day }: { day?: string }) {
  const hydrated = useHydrated();
  // 정적 페이지라 서버에서 만든 날짜는 낡을 수 있다. 브라우저에서 읽은 뒤에만 오늘 날짜를 적는다.
  const value = day ?? (hydrated ? localDate(new Date()) : "");
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return (
    <span className="hand-date num" aria-label={m ? `${m[1]}년 ${Number(m[2])}월 ${Number(m[3])}일` : undefined}>
      {m ? `${m[1]}. ${Number(m[2])}. ${Number(m[3])}` : ""}
    </span>
  );
}
