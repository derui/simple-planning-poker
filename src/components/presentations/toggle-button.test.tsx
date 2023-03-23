import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { ToggleButton } from "./toggle-button";

afterEach(cleanup);

test("apply initial checked", () => {
  render(<ToggleButton initialChecked={true} onToggle={() => {}} />);

  expect(screen.queryByTestId("root")).not.toBeNull();
  expect((screen.getByTestId("input") as HTMLInputElement).checked).toBe(true);
});

test("change checking when rail clicked", async () => {
  expect.assertions(2);
  render(
    <ToggleButton
      initialChecked={false}
      onToggle={(v) => {
        expect(v).toBe(true);
      }}
    />
  );

  await userEvent.click(screen.getByTestId("rail"));

  expect((screen.getByTestId("input") as HTMLInputElement).checked).toBe(true);
});

test("toggle checked state", async () => {
  render(<ToggleButton initialChecked={false} onToggle={() => {}} />);

  await userEvent.click(screen.getByTestId("rail"));

  expect((screen.getByTestId("input") as HTMLInputElement).checked).toBe(true);

  await userEvent.click(screen.getByTestId("rail"));

  expect((screen.getByTestId("input") as HTMLInputElement).checked).toBe(false);
});
