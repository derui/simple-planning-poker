import { cleanup, render } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { PlayerEstimation } from "./player-estimation.js";

afterEach(cleanup);

test("display player card as normal and not opened", async () => {
  const { container } = render(<PlayerEstimation name="user" />);

  expect(container.querySelector('[data-estimated="false"]')).not.toBeNull();
});

test("estimated card", async () => {
  const { container } = render(<PlayerEstimation name="user" estimated />);

  expect(container.querySelector('[data-estimated="true"]')).not.toBeNull();
});
