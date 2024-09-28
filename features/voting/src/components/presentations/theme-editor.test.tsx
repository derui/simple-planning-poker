import { test, afterEach, expect } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import { ThemeEditor } from "./theme-editor.js";
import { userEvent } from "@testing-library/user-event";

afterEach(cleanup);

test("should be able to render", async () => {
  const ret = render(<ThemeEditor theme="foo" />);

  expect(ret.container).toMatchSnapshot();
});

test("show editor after click button", async () => {
  render(<ThemeEditor theme="foo" />);

  await userEvent.click(screen.getByRole("button"));

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

  await userEvent.click(screen.getByRole("button"));
  await userEvent.type(screen.getByPlaceholderText(/theme/), " changed[Enter]");
});

test("cancel should return default", async () => {
  render(<ThemeEditor theme="foo" />);

  await userEvent.click(screen.getByRole("button"));
  await userEvent.click(screen.getByRole("button", { name: "cancel" }));

  expect(screen.queryByPlaceholderText(/theme/)).toBeNull();
});
