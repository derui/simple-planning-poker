import { cleanup, render } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { PlayerEstimations } from "./player-estimations.js";
import { PlayerEstimation } from "./player-estimation.js";

afterEach(cleanup);

test("display a estimation", async () => {
  const { container } = render(
    <PlayerEstimations total={5} estimations={[{ name: "foo", estimated: false }]}></PlayerEstimations>
  );

  expect(container).toMatchSnapshot();
});

test("loading", async () => {
  const { container } = render(
    <PlayerEstimations loading total={5} estimations={[{ name: "foo", estimated: true }]} />
  );

  expect(container.querySelector('[data-loading="true"]')).not.toBeNull();
});

test("all estimated", async () => {
  const estimations = Array.from(new Array(5)).map((_, index) => {
    return { name: `foo${index}`, estimated: true };
  });

  const { container } = render(<PlayerEstimations total={5} estimations={estimations} />);

  expect(container).toMatchSnapshot();
});
