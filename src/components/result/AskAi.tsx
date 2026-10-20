"use client";

import { useState } from "react";
import { copyText, downloadText, isInAppBrowser } from "@/lib/clipboard";

export const AI_LINKS = [
  { name: "ChatGPT", href: "https://chatgpt.com/" },
  { name: "Gemini", href: "https://gemini.google.com/app" },
  { name: "Claude", href: "https://claude.ai/new" },
];

type Status = "idle" | "copied" | "failed";

/**
 * 복사와 AI 열기를 한자리에서 한다(D25).
 * [AI에게 해석 받기]를 누르면 해석 프롬프트가 복사되고, 그 버튼 자리에 AI 버튼 세 개가 나타난다.
 * 바닥 영역이 커져 결과를 가리지 않게, 복사 뒤에는 큰 버튼을 없애고 한 줄 안내 + AI 버튼만 둔다.
 * AI 버튼을 누를 때도 한 번 더 복사한다. 그사이 그림 프롬프트를 복사해 클립보드가 바뀌었어도 해석 프롬프트가 붙여 넣어진다.
 */
export function AskAi({ prompt, fileName }: { prompt: string; fileName: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [inApp, setInApp] = useState(false);

  const copy = async () => {
    const ok = await copyText(prompt);
    setInApp(isInAppBrowser(navigator.userAgent));
    setStatus(ok ? "copied" : "failed");
  };

  if (status === "idle") {
    return (
      <button type="button" className="btn" onClick={copy}>
        AI에게 해석 받기
      </button>
    );
  }

  return (
    <div className="ask enter">
      {status === "copied" ? (
        <p className="ask-msg" role="status">
          <b>복사했어요.</b> 쓰는 AI를 누르고, 대화창에 붙여 넣어 보내 주세요.
        </p>
      ) : (
        <>
          <p className="ask-msg" role="status">
            자동 복사가 안 됐어요. 아래 글을 길게 눌러 복사해 주세요.
          </p>
          <textarea className="fallback-text" readOnly value={prompt} onFocus={(e) => e.currentTarget.select()} aria-label="해석 프롬프트 전체" />
        </>
      )}
      <div className="ai-links">
        {AI_LINKS.map((l) => (
          <a
            key={l.name}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${l.name} 새 창으로 열기`}
            onClick={() => {
              if (status === "copied") void copyText(prompt);
            }}
          >
            {l.name}
          </a>
        ))}
      </div>
      <p className="small-note">
        {inApp ? "앱 안 브라우저라면 오른쪽 위 메뉴의 '다른 브라우저로 열기'가 더 편해요. " : "휴대폰은 길게 눌러 붙여넣기, PC는 Ctrl+V. "}
        {status === "copied" ? (
          <button type="button" className="inline-link" onClick={copy}>
            다시 복사
          </button>
        ) : (
          <button type="button" className="inline-link" onClick={() => downloadText(fileName, prompt, "text/plain")}>
            텍스트 파일로 저장
          </button>
        )}
      </p>
    </div>
  );
}
