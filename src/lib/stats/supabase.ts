// 전체 검사 횟수 카운터(D61). Supabase에 숫자 하나만 올린다. 응답 내용·IP·결과는 보내지 않는다.
// - 브라우저에서 publishable key로만 접근한다(RLS로 읽기만 허용, 쓰기는 RPC 함수 하나).
// - 환경변수가 없거나 요청이 실패해도 앱은 그대로 동작한다(카운터 줄만 숨김).

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let client: SupabaseClient | null | undefined;

export function supabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  client = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return client;
}

export const COUNTER_TABLE = "completion_counter";
export const COUNTER_RPC = "increment_completion";

/** 지금까지의 전체 검사 횟수. 못 읽으면 null */
export async function fetchCompletionCount(): Promise<number | null> {
  const sb = supabase();
  if (!sb) return null;
  const { data, error } = await sb.from(COUNTER_TABLE).select("total").eq("id", 1).maybeSingle();
  if (error || !data) return null;
  return typeof data.total === "number" ? data.total : Number(data.total);
}

/**
 * 검사를 한 번 마쳤다고 센다. 한 결과당 한 번만 부른다. 실패는 조용히 넘긴다.
 * 돌려주는 값은 올린 뒤의 전체 횟수 = 이 결과의 일련번호(결과 화면 No. 칸, D67). 못 올리면 null.
 */
export async function recordCompletion(): Promise<number | null> {
  const sb = supabase();
  if (!sb) return null;
  // 자동 테스트(Playwright 등 webdriver)에서는 실제 숫자를 올리지 않는다.
  if (typeof navigator !== "undefined" && navigator.webdriver) return null;
  try {
    const { data, error } = await sb.rpc(COUNTER_RPC);
    if (error || data === null || data === undefined) return null;
    const n = Number(data);
    return Number.isFinite(n) ? n : null;
  } catch {
    // 네트워크가 막혀도 결과 화면은 그대로 보여 준다.
    return null;
  }
}
