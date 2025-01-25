import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { Input } from "./input.js";

afterEach(cleanup);

test("should be able to render", () => {
  const ret = render(<Input />);

  expect(ret.container).toMatchSnapshot();
});
