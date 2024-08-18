import { test, afterEach, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Icons } from "./icons";
import { Icon } from "./index";

afterEach(cleanup);

test("should be able to render", async () => {
  const ret = render(<Icon type={Icons.allowBackUp} />);

  expect(ret.container).toMatchSnapshot();
});

test("render other size small", async () => {
  const ret = render(<Icon size="s" type={Icons.check} />);

  expect(ret.container).toMatchSnapshot();
});

test("render size large", () => {
  const ret = render(<Icon size="l" type={Icons.chevronDown} />);

  expect(ret.container).toMatchSnapshot();
});
