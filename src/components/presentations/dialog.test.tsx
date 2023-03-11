import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dialog } from "./dialog";

afterEach(cleanup);

test("should be able to render", () => {
  render(<Dialog title="title" onSubmitClick={() => {}} buttonState="enabled" />);

  expect(screen.queryByText("title")).not.toBeNull();
  expect(screen.queryByText("Submit")?.tagName).toBe("BUTTON");
});

test("display children", () => {
  render(
    <Dialog title="title" onSubmitClick={() => {}} buttonState="enabled">
      <span>child</span>
    </Dialog>
  );

  expect(screen.queryByText("child")).not.toBeNull();
});

test("handle click footer button", async () => {
  expect.assertions(1);
  render(
    <Dialog
      title="title"
      onSubmitClick={() => {
        expect(true);
      }}
      buttonState="enabled"
    />
  );

  await userEvent.click(screen.getByRole("button"));
});

test("disable button while loading", async () => {
  render(<Dialog title="title" onSubmitClick={() => {}} buttonState="disabled" />);

  expect(screen.getByRole("button")).toHaveProperty("disabled", true);
});

test("show loader when loading", async () => {
  render(<Dialog title="title" onSubmitClick={() => {}} buttonState="loading" />);

  expect(screen.getByRole("button")).toHaveProperty("disabled", true);
  expect(screen.queryByTestId("loader/root")).not.toBeNull();
});
