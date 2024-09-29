import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { AveragePointShowcase } from "./average-point-showcase";

afterEach(cleanup);

test("should be able to render", () => {
  render(<AveragePointShowcase averagePoint="3" cardCounts={[]} />);

  expect(screen.queryByTestId("root")).not.toBeNull();
  expect(screen.queryAllByTestId("resultCard")).toHaveLength(0);
});

test("display cards with count", () => {
  render(
    <AveragePointShowcase
      averagePoint="3"
      cardCounts={[
        { point: 1, count: 2 },
        { point: 3, count: 4 },
      ]}
    />
  );

  expect(screen.getAllByTestId("resultCard")).toHaveLength(2);
  expect(screen.getAllByTestId("resultCard")[0].textContent).toMatch(/2 votes/);
  expect(screen.getAllByTestId("resultCard")[0].textContent).toMatch(/1/);
  expect(screen.getAllByTestId("resultCard")[1].textContent).toMatch(/4 votes/);
  expect(screen.getAllByTestId("resultCard")[1].textContent).toMatch(/3/);
});

test("display average", () => {
  render(<AveragePointShowcase averagePoint="3.5" cardCounts={[]} />);

  expect(screen.getByTestId("average").textContent).toMatch(/Score.*3.5/);
});
