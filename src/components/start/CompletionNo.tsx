"use client";

import { useEffect, useState } from "react";
import { HandNo } from "@/components/HandNo";
import { fetchCompletionCount } from "@/lib/stats/supabase";
import { formatCount } from "@/lib/text/format";

/** 메인 화면 No. 칸에 손글씨로 적는 "지금까지 적힌 장 수"(D61, D67). 못 읽으면 아무것도 그리지 않아 빈 밑줄로 남는다. */
export function CompletionNo() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    void fetchCompletionCount().then((n) => alive && setCount(n));
    return () => {
      alive = false;
    };
  }, []);
  if (count === null) return null;
  return <HandNo value={count} note={`지금까지 ${formatCount(count)}명이 해 봤어요`} />;
}
