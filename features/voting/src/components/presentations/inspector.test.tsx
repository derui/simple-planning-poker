import { test, afterEach, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Inspector } from "./inspector.js";

afterEach(cleanup);

test("should be able to render", async () => {
  const ret = render(<Inspector name="foo" />);

  expect(ret.container).toMatchSnapshot();
});
