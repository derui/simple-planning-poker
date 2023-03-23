import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { Skeleton } from "./skeleton";

afterEach(cleanup);

test("should be able to render", async () => {
  render(<Skeleton />);

  expect(screen.getByTestId("root")).not.toBeNull();
});
