"use client";

import { useEffect, useState } from "react";
import { fetchCompletionCount } from "@/lib/stats/supabase";
import { formatCount } from "@/lib/text/format";

/** 메인 안내문 끝에 이어 붙는 짧은 문장: " 지금까지 1,284명이 적어 봤어요." 못 읽으면 아무것도 그리지 않는다(D61). */
export function CompletionCount() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    void fetchCompletionCount().then((n) => alive && setCount(n));
    return () => {
      alive = false;
    };
  }, []);
  if (count === null) return null;
  return (
    <span className="count-inline enter">
      {" "}
      지금까지 <b className="num">{formatCount(count)}</b>명이 적어 봤어요.
    </span>
  );
}
