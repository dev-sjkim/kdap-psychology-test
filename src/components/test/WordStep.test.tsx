// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { __resetStoreForTest, testStore } from "@/lib/state/test-store";
import { stepById } from "@/lib/steps";
import { WordStep } from "./WordStep";

beforeEach(() => {
  vi.useFakeTimers();
  __resetStoreForTest();
  testStore.start();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("WordStep", () => {
  it("가치 단어 20개를 보여 주고, 누르면 고른 상태가 된다", () => {
    render(<WordStep step={stepById("values")} />);
    expect(screen.getAllByRole("button")).toHaveLength(20);
    const chip = screen.getByRole("button", { name: "배려" });
    fireEvent.click(chip);
    expect(chip.getAttribute("aria-pressed")).toBe("true");
    expect(testStore.getState().picks.values).toEqual(["v_care"]);
  });

  it("최대 개수를 넘게 누르면 고르지 않고 안내한다", () => {
    render(<WordStep step={stepById("values")} />);
    const chips = screen.getAllByRole("button");
    chips.slice(0, 6).forEach((c) => fireEvent.click(c));
    expect(testStore.getState().picks.values).toHaveLength(5);
    expect(screen.getByText(/최대 5개까지/)).toBeTruthy();
    act(() => vi.advanceTimersByTime(600));
    expect(screen.queryByText(/최대 5개까지/)).toBeNull();
  });

  it("남길 단어는 누른 순서대로 순위가 붙는다", () => {
    ["v_autonomy", "v_adventure", "v_friendship", "v_stability", "v_fairness"].forEach((id) => testStore.toggle("values", id));
    testStore.prepareNarrow();
    render(<WordStep step={stepById("narrow")} />);
    expect(screen.getAllByRole("button")).toHaveLength(5);
    fireEvent.click(screen.getByRole("button", { name: "우정" }));
    fireEvent.click(screen.getByRole("button", { name: "자율" }));
    expect(screen.getByRole("button", { name: "우정, 1순위" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "자율, 2순위" })).toBeTruthy();
  });
});
