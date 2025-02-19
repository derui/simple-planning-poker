import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { RadioGroup } from "./radio-group.js";

afterEach(cleanup);

test("should be able to render", () => {
  render(<RadioGroup />);

  expect(screen.queryByRole("radiogroup")).not.toBeNull();
});

test("render children", () => {
  render(
    <RadioGroup>
      <span>foo</span>
      <span>bar</span>
    </RadioGroup>
  );

  expect(screen.queryByText("foo")).not.toBeNull();
  expect(screen.queryByText("bar")).not.toBeNull();
});
