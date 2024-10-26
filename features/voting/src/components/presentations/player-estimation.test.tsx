import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { PlayerEstimation } from "./player-estimation.js";

afterEach(cleanup);

test("display player card as normal and not opened", () => {
  const { container } = render(<PlayerEstimation name="user" />);

  expect(container.querySelector('[data-estimated="false"]')).not.toBeNull();
});

test("estimated card", () => {
  const { container } = render(<PlayerEstimation name="user" estimated="1" />);

  expect(container.querySelector('[data-estimated="true"]')).not.toBeNull();
});
