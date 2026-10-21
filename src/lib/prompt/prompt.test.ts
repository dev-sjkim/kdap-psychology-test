import { describe, expect, it } from "vitest";
import { analyze } from "@/lib/analysis/analyze";
import { sampleInput } from "@/lib/analysis/fixtures";
import { josa } from "@/lib/text/josa";
import { ABOUT_TEST, PROMPT_INTRO, PROMPT_RULES, PROMPT_SECTIONS, buildCopyPrompt } from "./build-copy-prompt";
import { clearAnswerFact, promptDataSchema } from "./prompt-data";

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

  it("맨 위에 '# 마음결 · 날짜의 나' 제목을 쓰게 하고, 사람을 주인공으로 한 7개 항목을 이어지는 순서로 담는다(D59, D75, D76)", () => {
    expect(text).toContain("\n# 마음결 · 2026년 10월 20일의 나\n");
    expect(PROMPT_SECTIONS).toHaveLength(7);
    PROMPT_SECTIONS.forEach((s, i) => expect(text).toContain(`## ${i + 1}. ${s.title}:`));
    expect(PROMPT_SECTIONS[1].title).toBe("이런 사람이에요");
    expect(PROMPT_SECTIONS[2].title).toBe("이런 순간의 나");
    expect(PROMPT_SECTIONS[3].title).toBe("자주 부딪히는 지점");
    expect(PROMPT_SECTIONS[4].title).toBe("비우고 싶은 것과 키우고 싶은 것");
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
    expect(rules).toContain("2,800자 안팎");
    expect(rules).toContain("처음부터 끝까지 존댓말");
    expect(rules).toContain("덧붙이지 말아 주세요");
    expect(PROMPT_SECTIONS[0].ask).toContain("추측 표현을 붙이지 말아");
  });

  it("어색한 문체를 막는 규칙을 담고, 지시문 스스로도 그 문체를 쓰지 않는다(D74)", () => {
    const rules = PROMPT_RULES.join(" ");
    expect(rules).toContain("'당신'이라고 부르지 말고");
    expect(rules).toContain("옮겨 적지 말아");
    expect(rules).toContain("핵심을 짚을 때만 두 번까지");
    expect(rules).toContain("소설처럼 꾸미지 말아");
    expect(rules).toContain("데이터를 보며 평하는 말");
    // 모델은 지시문의 말투를 따라 한다. 규칙 문장 밖에서는 대구·감성 명사·괄호 보충을 쓰지 않는다
    const instructions = [PROMPT_INTRO, ...ABOUT_TEST, ...PROMPT_SECTIONS.map((s) => `${s.title} ${s.ask}`)].join("\n");
    expect(instructions).not.toMatch(/당신|아니라|(?<![가-힣])결[이을(]|[가-힣]\(/);
  });

  it("단어를 설명하지 않고 사람을 말하게 한다: 문단은 저에 대한 판단으로 열고, 고른 단어는 따옴표로 불러 근거로 쓴다(D75)", () => {
    const rules = PROMPT_RULES.join(" ");
    expect(rules).toContain("글의 주인공은 저예요");
    expect(rules).toContain("단어끼리 어떤 관계인지 설명하지 말고");
    expect(rules).toContain("문단 앞쪽에서 저에 대한 판단을 분명히");
    expect(text).toContain("band가 중간인 특성은");
    expect(rules).toContain("작은따옴표로 그대로 불러 근거로");
    expect(PROMPT_SECTIONS[0].ask).toContain("'~하는 사람' 꼴");
    expect(text).toContain("저에게 말할 때는 word를 써 주세요");
  });

  it("판단을 풀어 쓰고, 이미 아는 모습에서 시작해 한 줄기로 이어 가게 한다(D76)", () => {
    const rules = PROMPT_RULES.join(" ");
    expect(rules).toContain("판단만 던지지 말고 풀어 써 주세요");
    expect(rules).toContain("다른 답을 한 사람에게도 똑같이 맞을 말은 빼고");
    expect(rules).toContain("같은 성향이 어떤 상황에서 짐이 되는지");
    expect(rules).toContain("중심 줄기를 마지막 항목까지 이어 가");
    expect(rules).toContain("앞 항목에서 한 이야기를 받아 시작");
    expect(PROMPT_SECTIONS[1].ask).toContain("clear_answers와 뚜렷한 성격에서 출발해");
    expect(PROMPT_SECTIONS[4].ask).toContain("먼저 그럴 만하다고 알아봐");
    expect(PROMPT_SECTIONS[6].ask).toContain("2번에서 말한 제 모습을 다시 짚으며");
    const json = JSON.parse(text.match(/\n<result>\n([\s\S]*?)\n<\/result>/)![1]);
    expect(json.clear_answers.length).toBeGreaterThan(0);
  });

  it("짧다: 6,000자 이하이고 문항·단어 id나 밀리초 기록이 없다", () => {
    expect(text.length).toBeLessThanOrEqual(6000);
    expect(text).not.toMatch(/mipip_|v_care|n_busy|r_carry|durationMs|duration_ms/);
  });

  it("조사 병기나 위기 안내 문구가 없다", () => {
    expect(text).not.toMatch(/\((은|는|이|가|을|를|와|과)\)/);
    expect(text).not.toContain("109");
    expect(text).not.toContain("1577");
  });
});

describe("clear_answers", () => {
  it("응답을 나에게 사실인 문장으로 바꿔, 부정문에 아니라고 답한 것을 거꾸로 읽지 않게 한다(D76)", () => {
    expect(clearAnswerFact({ itemId: "mipip_08", trait: "conscientiousness", answer: 2 })).toEqual({ statement: "물건을 쓰고 나면 제자리에 잘 둬요.", how_much: "대체로 그래요" });
    expect(clearAnswerFact({ itemId: "mipip_10", trait: "openness", answer: 1 })).toEqual({ statement: "추상적인 생각에도 관심이 많아요.", how_much: "정말 그래요" });
    expect(clearAnswerFact({ itemId: "mipip_03", trait: "conscientiousness", answer: 5 })).toEqual({ statement: "자잘한 일은 미루지 않고 바로 해치워요.", how_much: "정말 그래요" });
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
