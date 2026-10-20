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
  await pick(page, 7);
  await expectNoScroll(page, "마음이 끌리는 단어(40개)");
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

  await expect(page).toHaveURL(/\/test\/release$/);
  await pick(page, 1);
  await expectNoScroll(page, "비워 내고 싶은 것");
  if (screenshots) await shot(page, "05b-release");
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
  await expect(page.locator(".headline")).toBeVisible();
  // 자세히 보기 전에는 결과 화면이 스크롤되지 않고, 복사 뒤에도 바닥 높이가 그대로다(D71)
  await expectNoScroll(page, "결과 화면(자세히 보기 전)");
  const footBefore = await page.locator(".foot:visible").boundingBox();
  const card = await page.getByRole("article", { name: "결과 카드" }).boundingBox();
  const button = await page.getByRole("button", { name: "AI에게 해석 받기" }).boundingBox();
  const viewport = page.viewportSize()!;
  expect(card!.y + card!.height).toBeLessThanOrEqual(button!.y + 4);
  expect(button!.y + button!.height).toBeLessThanOrEqual(viewport.height);

  await page.getByRole("button", { name: "AI에게 해석 받기" }).click();
  // AI 서비스 링크는 두지 않는다(D70). 안내 한 줄과 [다시 복사]·[텍스트 파일로 저장]만 남는다.
  await expect(page.getByRole("link")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("복사했어요");
  await expect(page.getByRole("button", { name: "다시 복사" })).toBeVisible();
  const footAfter = await page.locator(".foot:visible").boundingBox();
  expect(Math.abs(footAfter!.height - footBefore!.height)).toBeLessThanOrEqual(1);
  await expectNoScroll(page, "결과 화면(복사 뒤)");
  await page.waitForTimeout(400);
  await shot(page, "08-copied");
  const prompt = await page.evaluate(() => navigator.clipboard.readText());
  expect(prompt).toContain("<result>");
  expect(prompt).toContain("# 마음결 · ");
  expect(prompt).toContain("## 2. 기질이 가치를 만나는 지점");
  expect(prompt).toContain("## 6. 이번 주 작은 한 걸음");
  expect(prompt.length).toBeLessThan(4500);

  // 자세히 보기(D70): 펼치면 상세 맨 위로 스크롤되고, [접기]는 바닥 줄 위에 떠 있다. 접으면 맨 위로 돌아간다.
  await page.getByRole("button", { name: "자세히 보기" }).click();
  await expect(page.getByRole("heading", { name: "눈여겨볼 점" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 3000 }).toBeGreaterThan(40);
  const fold = page.locator(".foot .details-toggle.fold");
  await expect(fold).toBeVisible();
  const foldBox = await fold.boundingBox();
  expect(foldBox!.y + foldBox!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  await fold.click();
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 3000 }).toBe(0);
  await expect(page.getByRole("button", { name: "자세히 보기" })).toBeVisible();

  // 바닥은 한 줄 [AI에게 해석 받기][↺]. 다시 하기는 확인 모달을 거친다(D62).
  const row = await page.locator(".foot-row").boundingBox();
  const sq = await page.getByRole("button", { name: "처음부터 다시 하기" }).boundingBox();
  expect(Math.abs(sq!.width - sq!.height)).toBeLessThanOrEqual(1);
  // 정사각형은 바닥 줄의 첫 줄(맨 위)에 붙어 있고 오른쪽 끝이다.
  expect(Math.abs(sq!.y - row!.y)).toBeLessThanOrEqual(2);
  expect(sq!.x + sq!.width).toBeGreaterThan(row!.x + row!.width - 4);
  await page.getByRole("button", { name: "처음부터 다시 하기" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "계속 보기" }).click();
  await expect(page).toHaveURL(/\/result$/);
  await page.getByRole("button", { name: "처음부터 다시 하기" }).click();
  await page.getByRole("button", { name: "처음부터", exact: true }).click();
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
  await pick(page, 7);
  const eighth = page.locator(".chips .chip").nth(7);
  await expect(eighth).toHaveAttribute("aria-disabled", "true");
  await eighth.click({ force: true });
  await expect(page.getByText(/최대 7개까지/)).toBeVisible();
  await page.reload();
  await expect(page.locator(".chip[aria-pressed='true']")).toHaveCount(7);
  await page.goto("/");
  await expect(page.getByRole("button", { name: "시작하기" })).toBeVisible();
  await expect(page.getByRole("button", { name: /이어서 하기/ })).toHaveCount(0);
});

test("문항 번호 옆 ‹ › 로 오가고, 화살표는 숨지 않고 비활성으로 남는다", async ({ page }) => {
  await startTest(page);
  // 첫 문항의 ‹는 처음 화면으로 가는 버튼이고, 맨 위에는 따로 뒤로 화살표가 없다(D45).
  await expect(page.getByRole("button", { name: "처음 화면으로" })).toBeVisible();
  await expect(page.locator(".band-progress button.icon-btn")).toHaveCount(0); // 뒤로 화살표 없음(배경음 버튼은 있음)
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
  await page.getByRole("button", { name: "마음결에 대해" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  // 탭: 마음결 / 만든 사람. 탭과 내용이 모달 안에 들어온다. 크레딧은 각주로 늘 보인다.
  const dialog = page.getByRole("dialog");
  const dBox = await dialog.boundingBox();
  const tabBox = await page.getByRole("tab", { name: "마음결" }).boundingBox();
  expect(tabBox!.y).toBeGreaterThanOrEqual(dBox!.y);
  await expect(page.getByRole("heading", { name: "마음결은 무엇인가요" })).toBeVisible();
  // 세 번째 탭 [분석 방법]: 결과 화면에 있던 "어떻게 만들었나요?"가 여기로 왔다(D70)
  await page.getByRole("tab", { name: "분석 방법" }).click();
  await expect(page.getByRole("heading", { name: "어떻게 분석하나요" })).toBeVisible();
  await expect(page.getByText(/네 문항의 평균/)).toBeVisible();
  await page.getByRole("tab", { name: "만든 사람" }).click();
  await expect(page.getByText("공군 대위 김성준")).toBeVisible();
  await expect(page.getByText(/SIL 오픈 폰트/)).toBeVisible();
  const vp = page.viewportSize()!;
  const mBox = await dialog.boundingBox();
  expect(mBox!.y).toBeGreaterThanOrEqual(0);
  expect(mBox!.y + mBox!.height).toBeLessThanOrEqual(vp.height);
  await page.waitForTimeout(300);
  await shot(page, "12-maker-tab");
  await page.getByRole("tab", { name: "마음결" }).click();
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

test("배경음 버튼은 모든 화면 맨 위 줄 오른쪽 끝에 있고, 오늘 날짜가 손글씨로 적힌다", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /배경음/ });
  await expect(toggle).toBeVisible();
  const box = await toggle.boundingBox();
  const band = await page.locator(".band").first().boundingBox();
  // 맨 위 줄(band) 안, 오른쪽 끝에 있다.
  expect(box!.y).toBeGreaterThanOrEqual(band!.y - 1);
  expect(box!.y + box!.height).toBeLessThanOrEqual(band!.y + band!.height + 1);
  expect(box!.x + box!.width).toBeGreaterThan(band!.x + band!.width * 0.85);
  const before = await toggle.getAttribute("aria-pressed");
  await toggle.click();
  await expect(page.getByRole("button", { name: /배경음/ })).not.toHaveAttribute("aria-pressed", before ?? "");
  const today = new Date();
  await expect(page.locator(".hand-date:not(.hand-no):visible")).toHaveText(`${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`);
  // "?" 버튼은 메인 화면에만 있다.
  await expect(page.getByRole("button", { name: "마음결에 대해" })).toBeVisible();
  await page.getByRole("button", { name: "시작하기" }).click();
  const t2 = await page.locator("button[aria-label*='배경음']:visible").boundingBox();
  const band2 = await page.locator(".band:visible").first().boundingBox();
  expect(t2!.y + t2!.height).toBeLessThanOrEqual(band2!.y + band2!.height + 1);
  await expect(page.getByRole("button", { name: "마음결에 대해" })).toHaveCount(0);
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
