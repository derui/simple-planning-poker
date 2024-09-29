import { test, afterEach, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Inspectors } from "./inspectors.js";
import { Inspector } from "./inspector.js";

afterEach(cleanup);

test("should be able to render", () => {
  const ret = render(
    <Inspectors>
      <Inspector name="foo" />
      <Inspector name="bar" />
      <Inspector name="long name" />
    </Inspectors>
  );

  expect(ret.container).toMatchSnapshot();
});

test("render text if no children", () => {
  const ret = render(<Inspectors></Inspectors>);

  expect(ret.container).toMatchSnapshot();
});
