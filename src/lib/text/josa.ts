// 앞말의 받침에 맞춰 조사를 고른다. "와(과)" 같은 병기 대신 자연스러운 문장을 만들기 위해 쓴다.

type Pair = "은/는" | "이/가" | "을/를" | "와/과" | "으로/로" | "이에요/예요";

function lastHangul(word: string): number | null {
  for (let i = word.length - 1; i >= 0; i--) {
    const code = word.charCodeAt(i);
    if (code >= 0xac00 && code <= 0xd7a3) return code;
    if (/[0-9A-Za-z]/.test(word[i])) return null;
  }
  return null;
}

export function hasBatchim(word: string): boolean {
  const code = lastHangul(word);
  return code !== null && (code - 0xac00) % 28 !== 0;
}

function hasRieulBatchim(word: string): boolean {
  const code = lastHangul(word);
  return code !== null && (code - 0xac00) % 28 === 8;
}

/** [받침 있을 때, 받침 없을 때] */
const FORMS: Record<Pair, [string, string]> = {
  "은/는": ["은", "는"],
  "이/가": ["이", "가"],
  "을/를": ["을", "를"],
  "와/과": ["과", "와"],
  "으로/로": ["으로", "로"],
  "이에요/예요": ["이에요", "예요"],
};

/** 단어에 알맞은 조사를 붙인다. 예: josa("자기주도", "와/과") → "자기주도와" */
export function josa(word: string, pair: Pair): string {
  const [withBatchim, withoutBatchim] = FORMS[pair];
  // "으로/로"는 ㄹ 받침 뒤에서도 "로"를 쓴다(예: 서울로).
  if (pair === "으로/로") return word + (hasBatchim(word) && !hasRieulBatchim(word) ? withBatchim : withoutBatchim);
  return word + (hasBatchim(word) ? withBatchim : withoutBatchim);
}

/** 여러 단어를 "가, 나, 다"로 잇는다. */
export function joinList(words: string[]): string {
  return words.join(", ");
}
