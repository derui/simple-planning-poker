import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RadioButton } from "./radio-button";

afterEach(cleanup);

test("should be able to render", () => {
  render(<RadioButton label="label" name="name" value="foo" onChange={() => {}} />);

  expect(screen.queryByTestId("root")).not.toBeNull();
});

test("render label", () => {
  render(<RadioButton label="label" name="name" value="foo" onChange={() => {}} />);

  expect(screen.getByTestId("root").textContent).toMatch(/label/);
});

test("internal radio button", () => {
  render(<RadioButton label="label" name="name" value="foo" onChange={() => {}} />);

  const element = screen.getByTestId("input");

  expect(element).toHaveProperty("type", "radio");
  expect(element).toHaveProperty("name", "name");
  expect(element).toHaveProperty("value", "foo");
  expect(element).toHaveProperty("checked", false);
});

test("checked radio button", () => {
  render(<RadioButton checked label="label" name="name" value="foo" onChange={() => {}} />);

  const element = screen.getByTestId("input");

  expect(element).toHaveProperty("checked", true);
});

test("should be able to handle change if it is not checked", async () => {
  expect.assertions(1);
  render(
    <RadioButton
      label="label"
      name="name"
      value="foo"
      onChange={(value) => {
        expect(value).toBe("foo");
      }}
    />
  );

  await userEvent.click(screen.getByLabelText("label"));
});

test("do not raise event if checked", async () => {
  render(
    <RadioButton
      checked
      label="label"
      name="name"
      value="foo"
      onChange={() => {
        expect.fail();
      }}
    />
  );

  await userEvent.click(screen.getByLabelText("label"));
});
