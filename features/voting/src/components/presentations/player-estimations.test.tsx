import { cleanup, render } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { PlayerEstimations } from "./player-estimations.js";
import { PlayerEstimation } from "./player-estimation.js";

afterEach(cleanup);

test("display a estimation", async () => {
  const { container } = render(
    <PlayerEstimations>
      <PlayerEstimation name="foo"></PlayerEstimation>
    </PlayerEstimations>
  );

  expect(container).toMatchSnapshot();
});

test("loading", async () => {
  const { container } = render(<PlayerEstimations loading />);

  expect(container.querySelector('[data-loading="true"]')).not.toBeNull();
});
