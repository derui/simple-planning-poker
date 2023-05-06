import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RoundHistory } from "./round-history";

afterEach(cleanup);

test("should be able to render", () => {
  render(<RoundHistory id="id" finishedAt={new Date("2023-01-01T10:01:02")} averagePoint={5.2} />);

  expect(screen.getByTestId("point").textContent).toMatch(/5.2/);
  expect(screen.getByTestId("theme").textContent).toMatch(/No theme/);
  expect(screen.getByTestId("date").textContent).toMatch(/2023\/01\/01 10:01:02/);
});

test("render with theme", () => {
  render(<RoundHistory id="id" theme="a theme" finishedAt={new Date("2023-01-01T10:01:02")} averagePoint={5.2} />);

  expect(screen.getByTestId("theme").textContent).toMatch(/a theme/);
});

test("handle click root", async () => {
  expect.assertions(1);

  render(
    <RoundHistory
      id="id"
      theme="a theme"
      finishedAt={new Date("2023-01-01T10:01:02")}
      onClick={(id) => {
        expect(id).toBe("id");
      }}
      averagePoint={5.2}
    />
  );

  await userEvent.click(screen.getByTestId("root"));
});

test("show time string after clicked", async () => {
  render(<RoundHistory id="id" theme="a theme" finishedAt={new Date("2023-01-01T05:01:02")} averagePoint={5.2} />);

  expect(screen.queryByText("05:01:02")?.classList.contains("hidden")).toBeTruthy();

  await userEvent.click(screen.getByTestId("time"));

  expect(screen.queryByText("05:01:02")).not.toBeNull();
});
