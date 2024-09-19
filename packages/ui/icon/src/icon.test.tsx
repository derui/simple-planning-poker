import { test, afterEach, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Icons } from "./icons.js";
import { Icon } from "./icon.js";

afterEach(cleanup);

test("should be able to render", () => {
  const ret = render(<Icon type={Icons.allowBackUp} />);

  expect(ret.container).toMatchSnapshot();
});

test("render other size small", () => {
  const ret = render(<Icon size="s" type={Icons.check} />);

  expect(ret.container).toMatchSnapshot();
});

test("render size large", () => {
  const ret = render(<Icon size="l" type={Icons.chevronDown} />);

  expect(ret.container).toMatchSnapshot();
});

test("render change icon color variant", () => {
  const ret = render(<Icon size="l" type={Icons.chevronDown} variant="teal" />);

  expect(ret.container).toMatchSnapshot();
});
