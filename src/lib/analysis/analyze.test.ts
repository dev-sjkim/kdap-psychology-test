import { describe, expect, it } from "vitest";
import { LIKERT_ITEMS } from "@/data/likert";
import { VALUE_IDS } from "@/data/values";
import { TRAIT_ORDER, VALUE_WORDS } from "@/data/words";
import { analyze, findPatterns, tendencyOf, valueOrder } from "./analyze";
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

  it("가치 단어는 10가지 가치마다 2개씩이고 겹치지 않는다", () => {
    for (const v of VALUE_IDS) expect(VALUE_WORDS.filter((w) => w.value === v)).toHaveLength(2);
    expect(new Set(VALUE_WORDS.map((w) => w.word)).size).toBe(VALUE_WORDS.length);
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

describe("analyze", () => {
  const a = analyze(sampleInput());

  it("1순위로 남긴 단어의 가치가 결과 카드가 된다", () => {
    expect(a.card.valueId).toBe("benevolence");
    expect(a.values.kept.map((k) => k.word)).toEqual(["배려", "영향력", "리더십"]);
    expect(a.values.letGo.map((l) => l.word)).toEqual(["여유", "안정"]);
  });

  it("성격은 한쪽으로 기운 특성 중 가장 뚜렷한 두 개를 고른다", () => {
    expect(a.personality.highlights.map((t) => t.trait)).toEqual(["extraversion", "neuroticism"]);
    expect(a.personality.tendencies.find((t) => t.trait === "conscientiousness")!.band).toBe("middle");
  });

  it("눈여겨볼 연결을 찾는다", () => {
    expect(a.patterns).toEqual([
      "끝까지 남긴 세 단어 중 2개가 같은 가치(영향력)예요. 이 가치가 특히 크게 자리 잡고 있을 수 있어요.",
      "남긴 가치 중 배려와 영향력은 서로 반대 방향을 당기는 가치예요. 두 마음 사이에서 균형을 잡고 있을 수 있어요.",
      "더 키우고 싶은 힘(공존, 성취)은 끝까지 남긴 가치에 없어요. 지금 지키는 것과 바라는 방향 사이에 거리가 있을 수 있어요.",
    ]);
  });

  it("키우고 싶은 힘이 남긴 가치에 있거나, 내려놓은 단어의 가치를 다시 고르면 그렇게 짚는다", () => {
    const kept = [{ rank: 1, wordId: "v_care", word: "배려", valueId: "benevolence" as const }];
    const letGo = [{ word: "안정", valueId: "security" as const }];
    expect(findPatterns(kept, letGo, ["benevolence", "security"])).toEqual([
      "더 키우고 싶은 힘(안정)은 끝까지 남긴 가치에 없어요. 지금 지키는 것과 바라는 방향 사이에 거리가 있을 수 있어요.",
      "더 키우고 싶은 힘(배려)은 이미 끝까지 남긴 가치이기도 해요. 소중하지만 아직 충분히 누리지 못한다고 느낄 수 있어요.",
      "마지막에 내려놓은 '안정'의 가치(안정)를 더 키우고 싶은 힘으로 다시 골랐어요.",
    ]);
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
    expect(a.hesitation.slowest).toEqual({ stepId: "personality", title: "평소의 나", seconds: 32 });
    expect(a.hesitation.removed).toEqual([
      { stepId: "values", words: ["예의"] },
      { stepId: "grow", words: ["규범"] },
    ]);
  });

  it("응답이 빠지거나 개수가 맞지 않으면 오류를 낸다", () => {
    const missing = sampleInput();
    delete missing.answers.mipip_20;
    expect(() => analyze(missing)).toThrow(/mipip_20/);
    const outside = sampleInput();
    outside.picks.narrow = ["v_care", "v_influence", "v_nature"];
    expect(() => analyze(outside)).toThrow(/앞에서 고른/);
  });
});
