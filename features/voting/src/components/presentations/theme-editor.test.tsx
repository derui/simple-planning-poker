import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, expect, test } from "vitest";
import { ThemeEditor } from "./theme-editor.js";

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
  await userEvent.type(screen.getByPlaceholderText(/theme/), "changed");
  await userEvent.click(screen.getByRole("button", { name: "cancel" }));

  expect(screen.queryByText(/foo/)).not.toBeNull();
});

test("should be able to render without theme", () => {
  const ret = render(<ThemeEditor theme="" />);

  expect(ret.container).toMatchSnapshot();
});
