// docs/prompt-data-schema.json이 해석 프롬프트 데이터(zod)와 같은지 확인한다.
// 스키마를 바꿨다면 `npm run schema`로 문서를 다시 만든다.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { promptDataSchema } from "./prompt-data";

const DOC_PATH = join(process.cwd(), "docs", "prompt-data-schema.json");

describe("docs/prompt-data-schema.json", () => {
  it("zod 스키마에서 만든 JSON Schema와 같다", () => {
    const generated = JSON.stringify(z.toJSONSchema(promptDataSchema, { io: "input" }), null, 2) + "\n";
    if (process.env.UPDATE_SCHEMA) writeFileSync(DOC_PATH, generated);
    expect(readFileSync(DOC_PATH, "utf8")).toBe(generated);
  });
});
