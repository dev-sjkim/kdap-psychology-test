"use client";

import { useRouter } from "next/navigation";
import { bgm } from "@/lib/audio/bgm";
import { testStore } from "@/lib/state/test-store";

/** 메인 화면 바닥 버튼. 늘 [시작하기] 하나이고, 누르면 새로 시작해 첫 단계 주소로 간다(D39). */
export function StartActions() {
  const router = useRouter();
  const start = () => {
    bgm.start();
    testStore.start();
    router.push("/test/personality");
  };
  return (
    <button type="button" className="btn" onClick={start}>
      시작하기
    </button>
  );
}
