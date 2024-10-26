import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, expect, test } from "vitest";
import { PlayerEstimations } from "./player-estimations.js";

afterEach(cleanup);

test("display a estimation", () => {
  const { container } = render(<PlayerEstimations total={5} estimations={[{ name: "foo" }]}></PlayerEstimations>);

  expect(container).toMatchSnapshot();
});

test("loading", () => {
  const { container } = render(<PlayerEstimations loading total={5} estimations={[{ name: "foo", estimated: "1" }]} />);

  expect(container.querySelector('[data-loading="true"]')).not.toBeNull();
});

test("all estimated", () => {
  const estimations = Array.from(new Array(5)).map((_, index) => {
    return { name: `foo${index}`, estimated: "1" };
  });

  const { container } = render(<PlayerEstimations total={5} estimations={estimations} />);

  expect(container).toMatchSnapshot();
});

test("disable button if can not reveal", () => {
  const estimations = Array.from(new Array(5)).map((_, index) => {
    return { name: `foo${index}`, estimated: "3" };
  });

  const { container } = render(<PlayerEstimations total={5} estimations={estimations} />);

  expect(container).toMatchSnapshot();
});

test("call onReveal if it is revealable", async () => {
  expect.assertions(1);
  const estimations = Array.from(new Array(5)).map((_, index) => {
    return { name: `foo${index}`, estimated: "4" };
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
