// 화면에 보이는 숫자를 짧게 만든다. 숫자가 아무리 커져도 칸을 넘지 않게 하려는 것이다(D38).

/** 머문 시간: 59초 → "59초", 72초 → "1분 12초", 600초 이상 → "10분 넘게" */
export function formatSeconds(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s}초`;
  if (s >= 600) return "10분 넘게";
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return rest === 0 ? `${m}분` : `${m}분 ${rest}초`;
}

/**
 * 사람 수 같은 큰 수: 9,999까지는 쉼표, 1만 이상은 "1.2만", "128만", 1억 이상은 "1.3억".
 * 공개 카운터 같은 기능을 붙일 때도 이 함수를 쓴다.
 */
export function formatCount(n: number): string {
  const v = Math.max(0, Math.floor(n));
  if (v < 10_000) return v.toLocaleString("ko-KR");
  if (v < 100_000_000) {
    const man = v / 10_000;
    return `${man < 100 ? trim(man) : Math.floor(man).toLocaleString("ko-KR")}만`;
  }
  const eok = v / 100_000_000;
  return `${eok < 100 ? trim(eok) : Math.floor(eok).toLocaleString("ko-KR")}억`;
}

/** 소수 첫째 자리까지, 버림. 1.0이면 1로 쓴다. */
function trim(x: number): string {
  const one = Math.floor(x * 10) / 10;
  return Number.isInteger(one) ? String(one) : one.toFixed(1);
}
