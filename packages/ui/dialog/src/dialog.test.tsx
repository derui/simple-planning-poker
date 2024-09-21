import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { Dialog } from "./dialog.js";

afterEach(cleanup);

test("should be able to render", () => {
  render(<Dialog title="title" onSubmit={() => {}} />);

  expect(screen.queryByText("title")).not.toBeNull();
  expect(screen.queryByText("Submit")?.tagName).toEqual("BUTTON");
});

test("display children", () => {
  render(
    <Dialog title="title" onSubmit={() => {}}>
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
      onSubmit={() => {
        expect(true);
      }}
    />
  );

  await userEvent.click(screen.getByText("Submit"));
});

test("disable button while loading", async () => {
  render(<Dialog title="title" onSubmit={() => {}} buttonState="disabled" />);

  expect(screen.getByText("Submit")).toHaveProperty("disabled", true);
});

test("show loader when loading", async () => {
  render(<Dialog title="title" onSubmit={() => {}} buttonState="loading" />);

  expect(screen.getByText("Submit")).toHaveProperty("disabled", true);
  expect(screen.getByRole("alert")).not.toBeNull();
});

test("change element of content", async () => {
  render(<Dialog title="title" onSubmit={() => {}} buttonState="loading" rootElement="form" />);

  expect(screen.getByRole("article").tagName.toLowerCase()).toEqual("form");
});
