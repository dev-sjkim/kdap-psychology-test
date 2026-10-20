import { expect, test, type Page } from "@playwright/test";

// 시작 → /test/personality(10문항) → /test/values → /test/narrow → /test/now → /test/grow → /result.
// 화면 캡처는 e2e/.output/<프로젝트>/ 아래에 남긴다(커밋하지 않음).

const shot = (page: Page, name: string) =>
  page.screenshot({ path: `e2e/.output/${test.info().project.name}/${name}.png`, fullPage: false });

/** 지금 단계에서 앞쪽 단어 n개를 고른다. */
async function pick(page: Page, n: number) {
  const items = page.locator(".chips .chip, .cards .vcard");
  for (let i = 0; i < n; i++) await items.nth(i).click();
}

/** 스크롤 없이 한 화면에 들어오는지 확인한다(문서 높이 ≤ 화면 높이). */
async function expectNoScroll(page: Page, where: string) {
  const { scroll, view } = await page.evaluate(() => ({ scroll: document.documentElement.scrollHeight, view: window.innerHeight }));
  expect(scroll, `${where}: 문서 높이 ${scroll}px, 화면 높이 ${view}px`).toBeLessThanOrEqual(view + 1);
}

async function answerLikert(page: Page, screenshots = false) {
  await expect(page).toHaveURL(/\/test\/personality$/);
  for (let n = 1; n <= 20; n++) {
    await expect(page.locator(".q-count b")).toHaveText(String(n));
    if (n === 1) await expectNoScroll(page, "평소의 나 1번 문항");
    await page.getByRole("radio").nth((n * 2) % 5).click();
    if (screenshots && n === 3) await shot(page, "02-likert");
    await page.waitForTimeout(340);
  }
  await expect(page).toHaveURL(/\/test\/values$/);
}

async function startTest(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "시작하기" }).click();
}

async function walk(page: Page, screenshots = false) {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "마음결" })).toBeVisible();
  await expectNoScroll(page, "시작 화면");
  if (screenshots) await shot(page, "01-start");
  await page.getByRole("button", { name: "시작하기" }).click();

  await answerLikert(page, screenshots);

  await expect(page.getByRole("heading", { name: "마음이 끌리는 단어" })).toBeVisible();
  await pick(page, 5);
  await expectNoScroll(page, "마음이 끌리는 단어");
  if (screenshots) await shot(page, "03-values");
  await page.getByRole("button", { name: "다음", exact: true }).click();

  await expect(page).toHaveURL(/\/test\/narrow$/);
  await pick(page, 3);
  await expectNoScroll(page, "끝까지 남길 단어");
  if (screenshots) await shot(page, "04-narrow");
  await page.getByRole("button", { name: "다음", exact: true }).click();

  await expect(page).toHaveURL(/\/test\/now$/);
  await pick(page, 2);
  await expectNoScroll(page, "요즘의 나");
  if (screenshots) await shot(page, "05-now");
  await page.getByRole("button", { name: "다음", exact: true }).click();

  await expect(page).toHaveURL(/\/test\/grow$/);
  await pick(page, 1);
  await expectNoScroll(page, "더 키우고 싶은 힘");
  if (screenshots) await shot(page, "06-grow");
  await page.getByRole("button", { name: "결과 보기" }).click();

  await expect(page).toHaveURL(/\/result$/);
  await expect(page.getByRole("article", { name: "결과 카드" })).toBeVisible();
}

test("시작부터 결과, 해석 복사, 다시 하기까지", async ({ page, context }) => {
  test.setTimeout(120_000);
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await walk(page, true);
  await page.waitForTimeout(1800); // 그림이 다 그려진 뒤 찍는다
  await shot(page, "07-result");

  // 결과 카드와 주 버튼이 한 화면에 들어온다. 카드에는 성격 그래프와 가치 막대가 있다.
  await expect(page.getByRole("img", { name: /성격 다섯 특성 그래프/ })).toBeVisible();
  await expect(page.locator(".vbar")).toHaveCount(3);
  const card = await page.getByRole("article", { name: "결과 카드" }).boundingBox();
  const button = await page.getByRole("button", { name: "AI에게 해석 받기" }).boundingBox();
  const viewport = page.viewportSize()!;
  expect(card!.y + card!.height).toBeLessThanOrEqual(button!.y + 4);
  expect(button!.y + button!.height).toBeLessThanOrEqual(viewport.height);

  await page.getByRole("button", { name: "AI에게 해석 받기" }).click();
  await expect(page.getByRole("link", { name: /ChatGPT/ })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("복사했어요");
  await page.waitForTimeout(400);
  await shot(page, "08-copied");
  const prompt = await page.evaluate(() => navigator.clipboard.readText());
  expect(prompt).toContain("<result>");
  expect(prompt).toContain("# 마음결 · ");
  expect(prompt).toContain("## 7. 이번 주 작은 한 걸음");
  expect(prompt.length).toBeLessThan(4000);

  await page.getByRole("button", { name: "자세히 보기" }).click();
  await expect(page.getByRole("heading", { name: "눈여겨볼 점" })).toBeVisible();
  await page.getByRole("button", { name: "접기" }).click();

  // 처음부터 다시 하기는 두 번 눌러야 한다.
  await page.getByRole("button", { name: "처음부터 다시 하기" }).click();
  await expect(page.getByRole("button", { name: /한 번 더 누르면/ })).toBeVisible();
  await expect(page).toHaveURL(/\/result$/);
  await page.getByRole("button", { name: /한 번 더 누르면/ }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("클립보드가 막히면 같은 자리에 직접 복사할 글을 보여 준다", async ({ page }) => {
  test.setTimeout(120_000);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("blocked")) } });
    document.execCommand = () => false;
  });
  await walk(page);
  await page.getByRole("button", { name: "AI에게 해석 받기" }).click();
  await expect(page.locator(".ask-msg")).toHaveText(/자동 복사가 안 됐어요/);
  await expect(page.getByLabel("해석 프롬프트 전체")).toHaveValue(/<result>/);
  await expect(page.getByRole("button", { name: "텍스트 파일로 저장" })).toBeVisible();
});

test("메인 화면은 늘 시작하기만 있고, 새로고침해도 고른 단어가 남는다", async ({ page }) => {
  await startTest(page);
  await answerLikert(page);
  await pick(page, 5);
  const sixth = page.locator(".chips .chip").nth(5);
  await expect(sixth).toHaveAttribute("aria-disabled", "true");
  await sixth.click({ force: true });
  await expect(page.getByText(/최대 5개까지/)).toBeVisible();
  await page.reload();
  await expect(page.locator(".chip[aria-pressed='true']")).toHaveCount(5);
  await page.goto("/");
  await expect(page.getByRole("button", { name: "시작하기" })).toBeVisible();
  await expect(page.getByRole("button", { name: /이어서 하기/ })).toHaveCount(0);
});

test("문항 번호 옆 ‹ › 로 오가고, 화살표는 숨지 않고 비활성으로 남는다", async ({ page }) => {
  await startTest(page);
  // 첫 문항의 ‹는 처음 화면으로 가는 버튼이고, 맨 위에는 따로 뒤로 화살표가 없다(D45).
  await expect(page.getByRole("button", { name: "처음 화면으로" })).toBeVisible();
  await expect(page.locator(".band-progress button")).toHaveCount(0);
  const next = page.getByRole("button", { name: "다음 문항" });
  await expect(next).toBeDisabled();
  await page.waitForTimeout(500); // 문항 전환 애니메이션이 끝난 뒤 잰다
  const arrowBox = await next.boundingBox();
  for (let n = 1; n <= 3; n++) {
    await page.getByRole("radio").nth(3).click();
    await page.waitForTimeout(340);
  }
  await expect(page.locator(".q-count b")).toHaveText("4");
  const prev = page.getByRole("button", { name: "이전 문항" });
  await prev.click();
  await prev.click();
  await expect(page.locator(".q-count b")).toHaveText("2");
  await expect(next).toBeEnabled();
  await next.click();
  await expect(page.locator(".q-count b")).toHaveText("3");
  await expect(page.getByRole("radio").nth(3)).toHaveAttribute("aria-checked", "true");
  // 화살표 자리는 문항이 바뀌어도 그대로다.
  await page.waitForTimeout(500);
  expect(await next.boundingBox()).toEqual(arrowBox);
  await expect(page.locator(".foot:visible")).toHaveCount(0);
});

test("단계마다 주소가 따로 있고, 끝낸 단계 칸은 빨간색이며, 뒤로가기와 건너뛰기 막기가 동작한다", async ({ page }) => {
  // 아무것도 안 하고 3단계 주소로 오면 1단계로 돌려보낸다.
  await page.goto("/test/narrow");
  await expect(page).toHaveURL(/\/test\/personality$/);
  await answerLikert(page);
  const first = page.locator(".prog-track > span").first();
  await expect(first).toHaveClass(/done/);
  const color = await first.locator("i").evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(color).toBe("rgb(194, 73, 47)"); // --accent #c2492f
  await page.goBack();
  await expect(page).toHaveURL(/\/test\/personality$/);
  await expect(page.locator(".q-count b")).toHaveText("20");
});

test("근거 보기는 모달로 열리고 아래 화면이 밀리지 않는다", async ({ page }) => {
  await page.goto("/");
  const startBtn = page.getByRole("button", { name: "시작하기" });
  const before = await startBtn.boundingBox();
  await page.getByRole("button", { name: "이 테스트에 대해" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expectNoScroll(page, "근거 모달을 연 시작 화면");
  expect(await startBtn.boundingBox()).toEqual(before);
  await page.waitForTimeout(400);
  await shot(page, "11-basis-modal");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("PC에서 마우스를 올려도 글자 위치와 크기가 변하지 않는다", async ({ page, isMobile }) => {
  test.skip(isMobile, "마우스 호버는 PC에서만 확인한다");
  await page.setViewportSize({ width: 1280, height: 900 });
  await startTest(page);
  await answerLikert(page);
  await page.waitForTimeout(600); // 단계 전환 애니메이션이 끝난 뒤 잰다
  const chips = page.locator(".chips .chip");
  const before = await chips.evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => [r.x, r.y, r.width, r.height]));
  for (let i = 0; i < 4; i++) await chips.nth(i).hover();
  await chips.nth(0).click();
  await chips.nth(1).hover();
  await page.waitForTimeout(300);
  const after = await chips.evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => [r.x, r.y, r.width, r.height]));
  expect(after).toEqual(before);
});

test("배경음 버튼은 오른쪽 아래에 떠 있고 바닥 버튼과 겹치지 않으며, 오늘 날짜가 손글씨로 적힌다", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /배경음/ });
  await expect(toggle).toBeVisible();
  const box = await toggle.boundingBox();
  const start = await page.getByRole("button", { name: "시작하기" }).boundingBox();
  const viewport = page.viewportSize()!;
  const notebook = await page.locator(".notebook:visible").boundingBox();
  // 노트의 오른쪽 아래, 바닥 버튼 위에 있다(PC에서는 노트가 가운데 놓이므로 노트 기준으로 잰다).
  expect(box!.x + box!.width).toBeGreaterThan(notebook!.x + notebook!.width * 0.8);
  expect(box!.y + box!.height).toBeLessThanOrEqual(start!.y);
  expect(box!.y).toBeGreaterThan(viewport.height * 0.6);
  const before = await toggle.getAttribute("aria-pressed");
  await toggle.click();
  await expect(page.getByRole("button", { name: /배경음/ })).not.toHaveAttribute("aria-pressed", before ?? "");
  const today = new Date();
  await expect(page.locator(".hand-date:visible")).toHaveText(`${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`);
  // "?" 버튼은 메인 화면에만 있다.
  await expect(page.getByRole("button", { name: "이 테스트에 대해" })).toBeVisible();
  await page.getByRole("button", { name: "시작하기" }).click();
  await expect(page.locator("button[aria-label*='배경음']:visible")).toBeVisible();
  await expect(page.getByRole("button", { name: "이 테스트에 대해" })).toHaveCount(0);
});

test("글자는 드래그로 선택되지 않고, 결과의 프롬프트 상자만 선택할 수 있다", async ({ page }) => {
  test.setTimeout(120_000);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("blocked")) } });
    document.execCommand = () => false;
  });
  await page.goto("/");
  const sel = (q: string) => page.locator(q).first().evaluate((el) => getComputedStyle(el).userSelect);
  expect(await sel(".lede")).toBe("none");
  await walk(page);
  expect(await sel(".card-note")).toBe("none");
  await page.getByRole("button", { name: "AI에게 해석 받기" }).click();
  expect(await sel(".fallback-text")).toBe("text");
});
