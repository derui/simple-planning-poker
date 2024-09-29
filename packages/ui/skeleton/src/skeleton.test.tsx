import { test, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

import { Skeleton } from "./skeleton.js";

afterEach(cleanup);

test("should be able to render", () => {
  const { container } = render(<Skeleton />);

  expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
});
