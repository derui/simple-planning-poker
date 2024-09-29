import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { InspectorHolder } from "./inspector-holder";

afterEach(cleanup);

test("should be able to render", async () => {
  render(<InspectorHolder />);

  expect(screen.queryByTestId("root")).not.toBeNull();
});
