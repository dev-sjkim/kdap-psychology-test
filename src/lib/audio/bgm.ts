// 배경음(public/audio/bgm-loop.mp3, 80초 반복). D34.
// - 브라우저는 사용자 조작 없이 소리를 틀 수 없다. 그래서 [시작하기]나 소리 버튼을 누를 때만 재생을 시작한다.
// - iOS Safari는 audio.volume을 무시하므로 Web Audio의 GainNode로 소리 크기와 페이드를 다룬다.
// - 끄면 그 선택을 이 브라우저에 기억한다(localStorage, 실패해도 동작에는 문제없음).
// - 탭이 숨겨지면 멈추고, 다시 보이면 이어서 재생한다.

import { useSyncExternalStore } from "react";
import { STORAGE_PREFIX } from "@/lib/app-info";

const SRC = "/audio/bgm-loop.mp3";
const VOLUME = 0.35;
const FADE_IN_MS = 1200;
const FADE_OUT_MS = 400;
const PREF_KEY = `${STORAGE_PREFIX}:bgm`;

export interface BgmState {
  /** 사용자가 배경음을 켜 두었는지(기억된 선택) */
  enabled: boolean;
  /** 지금 소리가 나고 있는지 */
  playing: boolean;
}

const SERVER_STATE: BgmState = { enabled: true, playing: false };

function readPref(): boolean {
  try {
    return window.localStorage.getItem(PREF_KEY) !== "off";
  } catch {
    return true;
  }
}

function writePref(on: boolean) {
  try {
    window.localStorage.setItem(PREF_KEY, on ? "on" : "off");
  } catch {
    // 저장이 막혀도 이번 방문 동안은 그대로 동작한다.
  }
}

let state: BgmState = typeof window === "undefined" ? SERVER_STATE : { enabled: readPref(), playing: false };
const listeners = new Set<() => void>();
function set(patch: Partial<BgmState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

let audio: HTMLAudioElement | null = null;
let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let fadeTimer: number | undefined;

function ensureAudio(): HTMLAudioElement {
  if (audio) return audio;
  audio = new Audio(SRC);
  audio.loop = true;
  audio.preload = "auto";
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AC) {
      ctx = new AC();
      gain = ctx.createGain();
      gain.gain.value = 0;
      ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination);
    } else {
      audio.volume = 0;
    }
  } catch {
    ctx = null;
    gain = null;
    audio.volume = 0;
  }
  document.addEventListener("visibilitychange", () => {
    if (!audio || !state.playing) return;
    if (document.visibilityState === "hidden") audio.pause();
    else void audio.play().catch(() => set({ playing: false }));
  });
  return audio;
}

function fadeTo(target: number, ms: number) {
  if (gain && ctx) {
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(target, now + ms / 1000);
    return;
  }
  if (!audio) return;
  window.clearInterval(fadeTimer);
  const a = audio;
  const start = a.volume;
  const steps = Math.max(1, Math.round(ms / 50));
  let i = 0;
  fadeTimer = window.setInterval(() => {
    i += 1;
    a.volume = Math.min(1, Math.max(0, start + ((target - start) * i) / steps));
    if (i >= steps) window.clearInterval(fadeTimer);
  }, 50);
}

async function play() {
  const a = ensureAudio();
  try {
    await ctx?.resume();
    await a.play();
    fadeTo(VOLUME, FADE_IN_MS);
    set({ playing: true });
  } catch {
    // 자동 재생이 막히면 조용히 꺼진 상태로 둔다. 사용자가 소리 버튼을 누르면 다시 시도한다.
    set({ playing: false });
  }
}

function stop() {
  if (!audio) return;
  const a = audio;
  fadeTo(0, FADE_OUT_MS);
  window.setTimeout(() => a.pause(), FADE_OUT_MS + 20);
  set({ playing: false });
}

export const bgm = {
  getState: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  /** [시작하기]처럼 사용자가 누른 순간에 부른다. 켜 둔 상태면 재생을 시작한다. */
  start() {
    if (state.enabled && !state.playing) void play();
  },
  /** 소리 버튼 */
  toggle() {
    if (state.playing) {
      writePref(false);
      set({ enabled: false });
      stop();
    } else {
      writePref(true);
      set({ enabled: true });
      void play();
    }
  },
};

export function useBgm(): BgmState {
  return useSyncExternalStore(bgm.subscribe, bgm.getState, () => SERVER_STATE);
}
