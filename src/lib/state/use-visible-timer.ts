"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * key가 바뀐 뒤로 화면이 실제로 보였던 시간(ms)을 잰다.
 * 탭이 백그라운드로 가 있던 시간은 빼고, 화면이 숨겨지면(effect 정리) 측정을 멈춘다.
 */
export function useVisibleTimer(key: string): () => number {
  const acc = useRef(0);
  const since = useRef<number | null>(null);

  useEffect(() => {
    acc.current = 0;
    since.current = document.visibilityState === "visible" ? performance.now() : null;
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        since.current = performance.now();
      } else if (since.current !== null) {
        acc.current += performance.now() - since.current;
        since.current = null;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (since.current !== null) acc.current += performance.now() - since.current;
      since.current = null;
    };
  }, [key]);

  return useCallback(() => acc.current + (since.current !== null ? performance.now() - since.current : 0), []);
}
