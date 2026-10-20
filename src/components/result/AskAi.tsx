"use client";

import { useState } from "react";
import { copyText, downloadText } from "@/lib/clipboard";

type Status = "idle" | "copied" | "failed";

/**
 * 해석 프롬프트 복사(D25, D70).
 * [AI에게 해석 받기]를 누르면 프롬프트가 복사되고, 그 자리에 한 줄 안내만 남는다.
 * AI 서비스로 가는 링크는 두지 않는다(D70): 새 창이 로그인 화면으로 떨어지거나 휴대폰에서는 앱이 아닌 웹이 열려 오히려 헷갈렸다.
 * 사용자는 평소 쓰던 AI 앱이나 탭으로 옮겨 붙여 넣는다.
 */
export function AskAi({ prompt, fileName }: { prompt: string; fileName: string }) {
  const [status, setStatus] = useState<Status>("idle");

  const copy = async () => {
    const ok = await copyText(prompt);
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
          <b>복사했어요.</b> AI 대화창에 붙여 넣으세요.
        </p>
      ) : (
        <>
          <p className="ask-msg" role="status">
            자동 복사가 안 됐어요. 아래 글을 길게 눌러 복사해 주세요.
          </p>
          <textarea className="fallback-text" readOnly value={prompt} onFocus={(e) => e.currentTarget.select()} aria-label="해석 프롬프트 전체" />
        </>
      )}
      {/* 두 줄 안에 끝낸다(큰 버튼과 같은 높이, D71). 저장 안내는 다시 하기 모달이 맡는다 */}
      <p className="small-note">
        <button type="button" className="inline-link" onClick={copy}>
          다시 복사
        </button>
        {" · "}
        <button type="button" className="inline-link" onClick={() => downloadText(fileName, prompt, "text/plain")}>
          텍스트 파일로 저장
        </button>
      </p>
    </div>
  );
}
