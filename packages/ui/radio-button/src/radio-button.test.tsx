import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { RadioButton } from "./radio-button.js";

afterEach(cleanup);

test("should be able to render", () => {
  render(<RadioButton label="label" name="name" value="foo" onChange={() => {}} />);

  expect(screen.queryByRole("radio")).not.toBeNull();
});

test("render label", () => {
  render(<RadioButton label="label" name="name" value="foo" onChange={() => {}} />);

  expect(screen.queryByText("label")).not.toBeNull();
});

test("checked radio button", () => {
  const container = render(<RadioButton checked label="label" name="name" value="foo" onChange={() => {}} />);

  const element = container.container.querySelector("input");

  expect(element).toHaveProperty("checked", true);
});

test("should be able to handle change if it is not checked", async () => {
  expect.assertions(1);
  render(
    <RadioButton
      label="label"
      name="name"
      value="foo"
      onChange={() => {
        expect(true);
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
