import { test, afterEach, expect } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import { ThemeEditor } from "./theme-editor.js";
import { userEvent } from "@testing-library/user-event";

afterEach(cleanup);

test("should be able to render", () => {
  const ret = render(<ThemeEditor theme="foo" />);

  expect(ret.container).toMatchSnapshot();
});

test("show editor after click button", async () => {
  render(<ThemeEditor theme="foo" />);

  await userEvent.click(screen.getByRole("button", { name: "edit" }));

  expect(screen.queryAllByRole("button")).toHaveLength(2);
});

test("edit and submit changed theme", async () => {
  expect.assertions(1);
  render(
    <ThemeEditor
      theme="foo"
      onSubmit={(input) => {
        expect(input).toEqual("foo changed");
      }}
    />
  );

  await userEvent.click(screen.getByRole("button", { name: "edit" }));
  await userEvent.type(screen.getByPlaceholderText(/theme/), " changed[Enter]");
});

test("cancel should return default", async () => {
  render(<ThemeEditor theme="foo" />);

  await userEvent.click(screen.getByRole("button", { name: "edit" }));
  await userEvent.click(screen.getByRole("button", { name: "cancel" }));

  expect(screen.queryByPlaceholderText<HTMLInputElement>(/No theme/)?.value).toBe("foo");
});

test("focus input first when switched to edit mode", async () => {
  render(<ThemeEditor theme="foo" />);

  await userEvent.click(screen.getByRole("button", { name: "edit" }));

  expect(screen.getByRole<HTMLInputElement>("textbox").matches(":focus")).toBeTruthy();
});

test("should be able to render without theme", () => {
  const ret = render(<ThemeEditor theme="" />);

  expect(ret.container).toMatchSnapshot();
});
