import { describe, expect, it } from "vitest";
import { analyze } from "@/lib/analysis/analyze";
import { sampleInput } from "@/lib/analysis/fixtures";
import { josa } from "@/lib/text/josa";
import { ABOUT_TEST, PROMPT_INTRO, PROMPT_RULES, PROMPT_SECTIONS, buildCopyPrompt } from "./build-copy-prompt";
import { promptDataSchema } from "./prompt-data";

const analysis = analyze(sampleInput());

describe("해석 프롬프트", () => {
  const text = buildCopyPrompt(analysis);

  it("데이터를 앞에, 지시를 뒤에 두고 태그로 나눈다", () => {
    const order = ["\n<result>", "</result>", "<about_test>", "<rules>", "<answer_format>"].map((t) => text.indexOf(t));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it("<result> 안의 JSON은 PromptData 스키마를 통과하고, headline·patterns·release를 담는다", () => {
    const json = JSON.parse(text.match(/\n<result>\n([\s\S]*?)\n<\/result>/)![1]);
    expect(promptDataSchema.safeParse(json).success).toBe(true);
    expect(json.patterns.length).toBeGreaterThan(0);
    expect(typeof json.headline).toBe("string");
    expect(json.release).toEqual([{ word: "혼자 다 떠안기", makes_room_for: "배려" }]);
  });

  it("맨 위에 '# 마음결 · 날짜의 나' 제목을 쓰게 하고, 기질 × 가치 연결 중심의 7개 항목을 담는다(D59)", () => {
    expect(text).toContain("\n# 마음결 · 2026년 10월 20일의 나\n");
    expect(PROMPT_SECTIONS).toHaveLength(7);
    PROMPT_SECTIONS.forEach((s, i) => expect(text).toContain(`## ${i + 1}. ${s.title}:`));
    expect(PROMPT_SECTIONS[1].title).toBe("기질이 가치를 만나는 지점");
    expect(PROMPT_SECTIONS[2].title).toBe("가치 사이의 긴장");
    expect(PROMPT_SECTIONS[3].title).toBe("비우고 싶은 것과 키우고 싶은 것");
    expect(PROMPT_SECTIONS[5].title).toBe("이번 주 작은 한 걸음");
    expect(PROMPT_SECTIONS[6].title).toBe("응원 한마디");
    // 경쟁 서비스 항목 구성("확신과 열망", "세 장면 속의 나")은 더 쓰지 않는다
    expect(PROMPT_SECTIONS.map((s) => s.title)).not.toContain("세 장면 속의 나");
    expect(PROMPT_SECTIONS.map((s) => s.title)).not.toContain("확신과 열망");
  });

  it("두서없는 답을 막는 규칙을 담는다", () => {
    const rules = PROMPT_RULES.join(" ");
    expect(rules).toContain("괄호로 달지 말고");
    expect(rules).toContain("영어 키 이름");
    expect(rules).toContain("같은 비유나 표현을 되풀이하지");
    expect(rules).toContain("문단마다 한 번 정도만");
    expect(rules).toContain("1,800자 안팎");
    expect(rules).toContain("서로 다른 데이터를 반드시 이어서");
    expect(rules).toContain("처음부터 끝까지 존댓말");
    expect(rules).toContain("덧붙이지 말아 주세요");
    expect(PROMPT_SECTIONS[0].ask).toContain("추측 표현을 붙이지 말아");
  });

  it("어색한 문체를 막는 규칙을 담고, 지시문 스스로도 그 문체를 쓰지 않는다(D74)", () => {
    const rules = PROMPT_RULES.join(" ");
    expect(rules).toContain("'당신'이라고 부르지 말고");
    expect(rules).toContain("되읽지 말고");
    expect(rules).toContain("맞세우기 문장은 한 번까지만");
    expect(rules).toContain("데이터를 보며 평하는 말");
    // 모델은 지시문의 말투를 따라 한다. 규칙 문장 밖에서는 대구·감성 명사·괄호 보충을 쓰지 않는다
    const instructions = [PROMPT_INTRO, ...ABOUT_TEST, ...PROMPT_SECTIONS.map((s) => `${s.title} ${s.ask}`)].join("\n");
    expect(instructions).not.toMatch(/당신|아니라|(?<![가-힣])결[이을(]|[가-힣]\(/);
  });

  it("짧다: 4,500자 이하이고 문항·단어 id나 밀리초 기록이 없다", () => {
    expect(text.length).toBeLessThanOrEqual(4500);
    expect(text).not.toMatch(/mipip_|v_care|n_busy|r_carry|durationMs|duration_ms/);
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
