import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { PlayerEstimations } from "./player-estimations.js";
import { userEvent } from "@testing-library/user-event";

afterEach(cleanup);

test("display a estimation", () => {
  const { container } = render(
    <PlayerEstimations total={5} estimations={[{ name: "foo", estimated: false }]}></PlayerEstimations>
  );

  expect(container).toMatchSnapshot();
});

test("loading", () => {
  const { container } = render(
    <PlayerEstimations loading total={5} estimations={[{ name: "foo", estimated: true }]} />
  );

  expect(container.querySelector('[data-loading="true"]')).not.toBeNull();
});

test("all estimated", () => {
  const estimations = Array.from(new Array(5)).map((_, index) => {
    return { name: `foo${index}`, estimated: true };
  });

  const { container } = render(<PlayerEstimations total={5} estimations={estimations} />);

  expect(container).toMatchSnapshot();
});

test("disable button if can not reveal", () => {
  const estimations = Array.from(new Array(5)).map((_, index) => {
    return { name: `foo${index}`, estimated: true };
  });

  const { container } = render(<PlayerEstimations total={5} estimations={estimations} />);

  expect(container).toMatchSnapshot();
});

test("call onReveal if it is revealable", async () => {
  expect.assertions(1);
  const estimations = Array.from(new Array(5)).map((_, index) => {
    return { name: `foo${index}`, estimated: true };
  });

  render(
    <PlayerEstimations
      total={5}
      estimations={estimations}
      revealable
      onReveal={() => {
        expect(true).toBeTruthy();
      }}
    />
  );

  await userEvent.click(screen.getByRole("button"));
});
