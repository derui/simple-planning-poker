import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { SelectableCard } from "./selectable-card";

afterEach(cleanup);

test("display card", () => {
  render(<SelectableCard display="5" selected={false} onSelect={() => {}} />);

  expect(screen.getByText("5")).not.toBeNull();
  expect(screen.getByText("5").dataset).toHaveProperty("selected", "false");
});

test("select card", () => {
  render(<SelectableCard display="5" selected={true} onSelect={() => {}} />);

  expect(screen.getByText("5").dataset).toHaveProperty("selected", "true");
});

test("display other values", () => {
  render(<SelectableCard display="give up" selected={true} onSelect={() => {}} />);

  expect(screen.getByText("give up")).not.toBeNull();
});

test("callback clicked root", async () => {
  expect.assertions(1);
  render(
    <SelectableCard
      display="give up"
      selected={true}
      onSelect={() => {
        expect(true).toBe(true);
      }}
    />
  );

  await userEvent.click(screen.getByText("give up"));
});
