import { describe, expect, it } from "vitest";
import { analyze } from "@/lib/analysis/analyze";
import { sampleInput } from "@/lib/analysis/fixtures";
import { josa } from "@/lib/text/josa";
import { PROMPT_RULES, PROMPT_SECTIONS, buildCopyPrompt } from "./build-copy-prompt";
import { promptDataSchema } from "./prompt-data";

const analysis = analyze(sampleInput());

describe("해석 프롬프트", () => {
  const text = buildCopyPrompt(analysis);

  it("데이터를 앞에, 지시를 뒤에 두고 태그로 나눈다", () => {
    const order = ["\n<result>", "</result>", "<about_test>", "<rules>", "<answer_format>"].map((t) => text.indexOf(t));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it("<result> 안의 JSON은 PromptData 스키마를 통과하고, 앱이 찾은 연결을 담는다", () => {
    const json = JSON.parse(text.match(/\n<result>\n([\s\S]*?)\n<\/result>/)![1]);
    expect(promptDataSchema.safeParse(json).success).toBe(true);
    expect(json.patterns.length).toBeGreaterThan(0);
  });

  it("맨 위에 '# 마음결 · 날짜의 나' 제목을 쓰게 하고, 8개 항목을 담는다", () => {
    expect(text).toContain("\n# 마음결 · 2026년 10월 20일의 나\n");
    expect(PROMPT_SECTIONS).toHaveLength(8);
    PROMPT_SECTIONS.forEach((s, i) => expect(text).toContain(`## ${i + 1}. ${s.title}:`));
    expect(PROMPT_SECTIONS[6].title).toBe("이번 주 작은 한 걸음");
    expect(PROMPT_SECTIONS[7].title).toBe("응원 한마디");
    expect(PROMPT_SECTIONS[3].ask).toContain("힘을 얻는 방식과 지치는 방식");
  });

  it("두서없는 답을 막는 규칙을 담는다", () => {
    const rules = PROMPT_RULES.join(" ");
    expect(rules).toContain("괄호로 달지 말고");
    expect(rules).toContain("영어 키 이름");
    expect(rules).toContain("같은 비유나 표현을 되풀이하지");
    expect(rules).toContain("문단마다 한 번 정도만");
    expect(rules).toContain("2,000자 안팎");
    expect(rules).toContain("처음부터 끝까지 존댓말");
    expect(rules).toContain("덧붙이지 말아 주세요");
    expect(PROMPT_SECTIONS[0].ask).toContain("추측 표현을 붙이지 말아");
  });

  it("짧다: 4,000자 이하이고 문항·단어 id나 밀리초 기록이 없다", () => {
    expect(text.length).toBeLessThanOrEqual(4000);
    expect(text).not.toMatch(/mipip_|v_care|n_busy|durationMs|duration_ms/);
  });

  it("조사 병기나 위기 안내 문구가 없다", () => {
    expect(text).not.toMatch(/\((은|는|이|가|을|를|와|과)\)/);
    expect(text).not.toContain("109");
    expect(text).not.toContain("1577");
  });
});

describe("josa", () => {
  it("받침에 맞춰 조사를 고른다", () => {
    expect(josa("자기주도", "와/과")).toBe("자기주도와");
    expect(josa("공존", "와/과")).toBe("공존과");
    expect(josa("안정", "은/는")).toBe("안정은");
    expect(josa("배려", "을/를")).toBe("배려를");
    expect(josa("'영향력'", "을/를")).toBe("'영향력'을");
    expect(josa("높은 편", "으로/로")).toBe("높은 편으로");
  });
});
