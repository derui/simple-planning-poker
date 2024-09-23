import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { PlayerEstimations } from "./player-estimations.js";
import { PlayerEstimation } from "./player-estimation.js";

afterEach(cleanup);

test("display a estimation", async () => {
  render(
    <PlayerEstimations>
      <PlayerEstimation name="foo" state="revealed" mode="player">
        5
      </PlayerEstimation>
    </PlayerEstimations>
  );

  expect(screen.queryByText("5")).not.toBeNull();
});

test("loading", async () => {
  const { container } = render(<PlayerEstimations loading />);

  expect(container.querySelector('[data-loading="true"]')).not.toBeNull();
});
