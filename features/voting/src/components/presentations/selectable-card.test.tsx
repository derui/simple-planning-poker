import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { userEvent } from "@testing-library/user-event";
import { SelectableCard } from "./selectable-card.js";

afterEach(cleanup);

test("display card", () => {
  render(<SelectableCard>5</SelectableCard>);

  expect(screen.getByText("5")).not.toBeNull();
  expect(screen.getByText("5").dataset).not.toHaveProperty("selected", undefined);
});

test("select card", () => {
  render(<SelectableCard selected>5</SelectableCard>);

  expect(screen.getByText("5").dataset).toHaveProperty("selected", "true");
});

test("display other values", () => {
  render(<SelectableCard selected>give up</SelectableCard>);

  expect(screen.getByText("give up")).not.toBeNull();
});

test("callback clicked root", async () => {
  expect.assertions(1);

  render(
    <SelectableCard
      onSelect={() => {
        expect(true).toBe(true);
      }}
    >
      give up
    </SelectableCard>
  );

  await userEvent.click(screen.getByText("give up"));
});
