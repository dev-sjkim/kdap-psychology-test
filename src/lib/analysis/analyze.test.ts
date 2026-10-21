import { describe, expect, it } from "vitest";
import { LIKERT_ITEMS } from "@/data/likert";
import { VALUE_IDS } from "@/data/values";
import { RELEASE_WORDS, TRAIT_ORDER, VALUE_WORDS } from "@/data/words";
import { analyze, findPatterns, pickClearAnswers, tendencyOf, traitValueLink, valueOrder } from "./analyze";
import { sampleInput } from "./fixtures";

describe("문항과 단어 목록", () => {
  it("성격 문항은 Mini-IPIP 원판 20문항, 특성마다 4문항이다", () => {
    expect(LIKERT_ITEMS).toHaveLength(20);
    for (const trait of TRAIT_ORDER) {
      const items = LIKERT_ITEMS.filter((i) => i.trait === trait);
      expect(items).toHaveLength(4);
      expect(items.some((i) => i.keyed === "+")).toBe(true);
      expect(items.some((i) => i.keyed === "-")).toBe(true);
    }
  });

  it("성격 문항마다 아니라고 답했을 때 사실이 되는 반대 문장이 있다(D76)", () => {
    for (const i of LIKERT_ITEMS) {
      expect(i.oppositeText.length).toBeGreaterThan(5);
      expect(i.oppositeText).not.toBe(i.text);
      expect(i.oppositeText.endsWith("요.")).toBe(true);
    }
  });

  it("가치 단어는 10가지 가치마다 4개씩(40개), 모두 3자 이하이고 겹치지 않는다", () => {
    expect(VALUE_WORDS).toHaveLength(40);
    for (const v of VALUE_IDS) expect(VALUE_WORDS.filter((w) => w.value === v)).toHaveLength(4);
    expect(new Set(VALUE_WORDS.map((w) => w.word)).size).toBe(VALUE_WORDS.length);
    for (const w of VALUE_WORDS) expect(w.word.length).toBeLessThanOrEqual(3);
  });

  it("비워 내고 싶은 것 단어는 모두 가치와 짝지어 있고 임상 단어가 없다", () => {
    expect(RELEASE_WORDS.length).toBeGreaterThanOrEqual(10);
    for (const w of RELEASE_WORDS) expect(VALUE_IDS).toContain(w.value);
    for (const w of RELEASE_WORDS) expect(w.word).not.toMatch(/우울|불안|강박|중독|장애/);
  });
});

describe("tendencyOf", () => {
  it("역방향 문항을 뒤집어 네 문항 평균을 내고, 3.75 이상은 높은 쪽, 2.25 이하는 낮은 쪽으로 본다", () => {
    const E = (a: number, b: number, c: number, d: number) => ({ mipip_01: a, mipip_06: b, mipip_11: c, mipip_16: d });
    expect(tendencyOf("extraversion", E(5, 1, 5, 1))).toMatchObject({ mean: 5, ratio: 1, band: "high", lean: "사람들 속에서 힘이 나는 쪽", strong: true });
    expect(tendencyOf("extraversion", E(4, 2, 4, 2))).toMatchObject({ mean: 4, band: "high", strong: false });
    expect(tendencyOf("extraversion", E(4, 2, 3, 3))).toMatchObject({ mean: 3.5, band: "middle", lean: "상황에 따라 달라지는 편" });
    expect(tendencyOf("neuroticism", { mipip_04: 1, mipip_09: 5, mipip_14: 1, mipip_19: 5 })).toMatchObject({ mean: 1, ratio: 0, band: "low", lean: "마음이 잘 흔들리지 않는 쪽" });
  });
});

describe("traitValueLink (기질 × 1순위 가치)", () => {
  const high = (trait: (typeof TRAIT_ORDER)[number]) => ({ trait, mean: 4.5, ratio: 0.875, band: "high" as const, lean: "", strong: true });
  const low = (trait: (typeof TRAIT_ORDER)[number]) => ({ trait, mean: 1.5, ratio: 0.125, band: "low" as const, lean: "", strong: true });

  it("같은 방향이면 맞물린다고, 다른 방향이면 과제라고 말한다", () => {
    expect(traitValueLink([high("agreeableness")], "benevolence")).toBe("다른 사람 마음을 먼저 살피는 편이고, 1순위로 배려를 남겼어요. 성격과 가치가 같은 쪽을 보고 있어요.");
    expect(traitValueLink([low("openness")], "stimulation")).toMatch(/^현실적이고 실용적인 편인데, 1순위로 새로움을 남겼어요\. .*애쓰는 때가 있을 거예요\.$/);
  });

  it("중간이거나 짝이 없는 가치(즐거움)면 null", () => {
    expect(traitValueLink([{ ...high("openness"), band: "middle", mean: 3 }], "self_direction")).toBeNull();
    expect(traitValueLink([high("extraversion")], "hedonism")).toBeNull();
  });
});

describe("analyze", () => {
  const a = analyze(sampleInput());

  it("1순위로 남긴 단어의 가치가 결과 카드가 되고, 내려놓은 단어는 4개다", () => {
    expect(a.card.valueId).toBe("benevolence");
    expect(a.values.kept.map((k) => k.word)).toEqual(["배려", "영향력", "리더십"]);
    expect(a.values.letGo.map((l) => l.word)).toEqual(["여유", "안정", "성장", "자연"]);
  });

  it("첫 패턴(headline)은 기질 × 1순위 가치 연결이고, 비움 단어가 남긴 가치와 이어진다", () => {
    expect(a.headline).toBe("다른 사람 마음을 먼저 살피는 편이고, 1순위로 배려를 남겼어요. 성격과 가치가 같은 쪽을 보고 있어요.");
    expect(a.patterns).toContain("끝까지 남긴 세 단어 중 2개가 영향력 쪽 단어예요. 지금 가장 크게 자리 잡은 가치예요.");
    expect(a.patterns).toContain("'혼자 다 떠안기'를 내려놓고 싶다고 했는데, 그 자리에 들어설 배려는 끝까지 남긴 가치이기도 해요. 지키고 싶은 걸 지금 이게 가리고 있는 셈이에요.");
    expect(a.patterns.length).toBeLessThanOrEqual(5);
    expect(a.release).toEqual([{ word: "혼자 다 떠안기", valueId: "benevolence" }]);
  });

  it("비움 단어가 키우고 싶은 힘과 같은 방향이면 그렇게 짚는다", () => {
    const kept = [{ rank: 1, wordId: "v_care", word: "배려", valueId: "benevolence" as const }];
    const out = findPatterns([], kept, [], [{ word: "뻔해진 하루", valueId: "stimulation" }], ["stimulation"]);
    expect(out[0]).toBe("'뻔해진 하루'를 내려놓으면 자리가 생기는 새로움을 키우고 싶은 힘으로도 골랐어요. 비우려는 것과 키우려는 것이 같은 방향이에요.");
  });

  it("내려놓은 단어의 가치를 다시 키우고 싶다고 고르면 받침에 맞는 조사로 짚고, 단어와 가치 이름이 같으면 한 번만 쓴다", () => {
    const kept = [{ rank: 1, wordId: "v_drive", word: "추진력", valueId: "power" as const }];
    const viaWord = findPatterns([], kept, [{ word: "모험", valueId: "stimulation" }], [], ["stimulation"]);
    expect(viaWord.at(-1)).toBe("마지막에 내려놓은 '모험'과 같은 쪽인 새로움을 키우고 싶은 힘으로 다시 골랐어요.");
    const sameName = findPatterns([], kept, [{ word: "영향력", valueId: "power" }], [], ["power"]);
    expect(sameName.at(-1)).toBe("마지막에 내려놓은 '영향력'을 키우고 싶은 힘으로 다시 골랐어요.");
  });

  it("가장 분명하게 답한 문항을 최대 4개, 양 끝 답을 먼저, 같은 세기면 다른 특성을 먼저 고른다(D76)", () => {
    const answers = Object.fromEntries(LIKERT_ITEMS.map((i) => [i.id, 3]));
    Object.assign(answers, { mipip_01: 5, mipip_06: 1, mipip_03: 5, mipip_13: 4, mipip_05: 2 });
    const picked = pickClearAnswers(answers);
    expect(picked.map((c) => c.itemId)).toEqual(["mipip_01", "mipip_03", "mipip_06", "mipip_05"]);
    expect(pickClearAnswers(Object.fromEntries(LIKERT_ITEMS.map((i) => [i.id, 3])))).toEqual([]);
  });

  it("가치 순서: 남긴 순위가 앞서고, 같은 점수면 더 높은 순위로 남긴 가치가 먼저다", () => {
    expect(valueOrder(["v_autonomy", "v_adventure", "v_thrill", "v_care", "v_nature"], ["v_autonomy", "v_adventure", "v_thrill"])).toEqual([
      "self_direction",
      "stimulation",
      "benevolence",
      "universalism",
    ]);
  });

  it("가장 오래 머문 단계와 골랐다가 뺀 단어", () => {
    expect(a.hesitation.slowest).toEqual({ stepId: "personality", title: "평소의 나", seconds: 62 });
    expect(a.hesitation.removed).toEqual([
      { stepId: "values", words: ["예의"] },
      { stepId: "release", words: ["늘 쫓기는 느낌"] },
      { stepId: "grow", words: ["규범"] },
    ]);
  });

  it("응답이 빠지거나 개수가 맞지 않으면 오류를 낸다", () => {
    const missing = sampleInput();
    delete missing.answers.mipip_20;
    expect(() => analyze(missing)).toThrow(/mipip_20/);
    const outside = sampleInput();
    outside.picks.narrow = ["v_care", "v_influence", "v_fun"];
    expect(() => analyze(outside)).toThrow(/앞에서 고른/);
    const noRelease = sampleInput();
    noRelease.picks.release = [];
    expect(() => analyze(noRelease)).toThrow(/비워 내고 싶은 것/);
  });
});
