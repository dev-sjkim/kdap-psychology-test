"use client";

import { useEffect, useState } from "react";
import { HandNo } from "@/components/HandNo";
import { fetchCompletionCount } from "@/lib/stats/supabase";
import { formatCount } from "@/lib/text/format";

/** 돌아올 때마다 읽되, 알트탭을 연타해도 이 간격 안에서는 한 번만 */
const REFRESH_MIN_GAP_MS = 10_000;

/**
 * 메인 화면 No. 칸에 손글씨로 적는 "지금까지 적힌 장 수"(D61, D67). 못 읽으면 아무것도 그리지 않아 빈 밑줄로 남는다.
 * 처음 한 번 읽고, 그 뒤로는 사람이 탭이나 창으로 **돌아올 때**(visibilitychange·focus·pageshow)만 다시 읽는다(D74).
 * 타이머 폴링이나 실시간 연결은 두지 않는다. 숫자가 바뀌면 key가 바뀌어 손글씨가 새로 스민다.
 */
export function CompletionNo() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    let lastRead = 0;

    const read = () => {
      lastRead = Date.now();
      void fetchCompletionCount().then((n) => {
        if (alive && n !== null) setCount(n);
      });
    };
    const onReturn = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastRead < REFRESH_MIN_GAP_MS) return;
      read();
    };

    read();
    document.addEventListener("visibilitychange", onReturn);
    window.addEventListener("focus", onReturn);
    window.addEventListener("pageshow", onReturn);
    return () => {
      alive = false;
      document.removeEventListener("visibilitychange", onReturn);
      window.removeEventListener("focus", onReturn);
      window.removeEventListener("pageshow", onReturn);
    };
  }, []);

  if (count === null) return null;
  return <HandNo key={count} value={count} note={`지금까지 ${formatCount(count)}명이 해 봤어요`} />;
}
