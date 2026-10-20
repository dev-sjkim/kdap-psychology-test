"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formatCount } from "@/lib/text/format";

/** 탭으로 연 메모가 저절로 사라지기까지 */
const AUTO_HIDE_MS = 2500;

/**
 * 노트 인쇄 칸 No. 밑줄 위의 손글씨 번호(D67)와, 그 뜻을 알려 주는 작은 메모(D73).
 * PC는 마우스를 올리면, 휴대폰은 번호를 탭하면 번호 아래에 회색 인쇄체로 한 줄이 스민다.
 * 메모는 absolute라 머리줄·본문이 밀리지 않는다. 탭으로 연 것은 2.5초 뒤나 다른 곳을 누르면 닫힌다.
 */
export function HandNo({ value, note }: { value: number; note: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const pointer = useRef<string>("mouse");
  const btn = useRef<HTMLButtonElement>(null);

  const clear = () => window.clearTimeout(timer.current);
  const show = (autoHide: boolean) => {
    clear();
    setOpen(true);
    if (autoHide) timer.current = window.setTimeout(() => setOpen(false), AUTO_HIDE_MS);
  };
  const hide = () => {
    clear();
    setOpen(false);
  };

  // 열려 있는 동안 다른 곳을 누르면 닫는다(휴대폰).
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!btn.current?.contains(e.target as Node)) hide();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  });

  useEffect(() => clear, []);

  return (
    <>
      <button
        ref={btn}
        type="button"
        className="hand-date hand-no num enter"
        aria-label={note}
        aria-describedby={id}
        aria-expanded={open}
        onPointerDown={(e) => {
          pointer.current = e.pointerType;
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") show(false);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") hide();
        }}
        onClick={() => {
          // 마우스는 올리는 것만으로 열리므로 클릭은 손대지 않는다. 손가락·펜은 탭으로 여닫는다.
          if (pointer.current === "mouse") return;
          if (open) hide();
          else show(true);
        }}
        // 탭·클릭으로 생긴 포커스는 무시한다. 탭은 포커스 뒤에 click이 따라와 한 번에 열렸다 닫히기 때문이다. 키보드 포커스만 연다.
        onFocus={(e) => {
          if (e.currentTarget.matches(":focus-visible")) show(false);
        }}
        onBlur={hide}
      >
        {formatCount(value)}
      </button>
      <span id={id} role="tooltip" className={`no-note ${open ? "open" : ""}`}>
        {note}
      </span>
    </>
  );
}
