"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { testStore } from "@/lib/state/test-store";

/** 결과는 저장되지 않으므로, 잘못 눌러 결과를 잃지 않게 두 번 눌러야 처음부터 다시 시작한다. */
export function RestartButton() {
  const router = useRouter();
  const [armed, setArmed] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = () => {
    if (!armed) {
      setArmed(true);
      timer.current = window.setTimeout(() => setArmed(false), 3000);
      return;
    }
    window.clearTimeout(timer.current);
    testStore.reset();
    router.push("/");
  };

  return (
    <button type="button" className={`restart ${armed ? "armed" : ""}`} onClick={onClick} aria-live="polite">
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M5 12 A7 7 0 1 0 7.5 6.6 M5 4.5 V8.5 H9" />
      </svg>
      {armed ? "한 번 더 누르면 처음부터 시작해요" : "처음부터 다시 하기"}
    </button>
  );
}
