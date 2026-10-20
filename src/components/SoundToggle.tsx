"use client";

import { bgm, useBgm } from "@/lib/audio/bgm";

/**
 * 배경음 버튼. 노트 왼쪽 여백 칸, 맨 위 줄 바로 아래에 둔다(D42).
 * 여백 칸에는 내용이 없어 어느 화면에서도 같은 자리에 둘 수 있다. 켜져 있으면 음파, 꺼져 있으면 사선.
 */
export function SoundToggle() {
  const { playing } = useBgm();
  return (
    <button
      type="button"
      className={`sound-fab ${playing ? "on" : ""}`}
      aria-pressed={playing}
      aria-label={playing ? "배경음 끄기" : "배경음 켜기"}
      title={playing ? "배경음 끄기" : "배경음 켜기"}
      onClick={() => bgm.toggle()}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M4 9.5 H7.5 L12 6 V18 L7.5 14.5 H4 Z" />
        {playing ? <path d="M15.5 9.5 C 16.6 10.6, 16.6 13.4, 15.5 14.5 M18 7.5 C 20.2 9.6, 20.2 14.4, 18 16.5" /> : <path d="M16 9.5 L21 14.5 M21 9.5 L16 14.5" />}
      </svg>
    </button>
  );
}
