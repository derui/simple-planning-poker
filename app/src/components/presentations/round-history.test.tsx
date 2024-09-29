import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RoundHistory } from "./round-history";

afterEach(cleanup);

test("should be able to render", () => {
  render(<RoundHistory id="id" finishedAt={"2023-01-01T10:01:02"} averagePoint={5.2} />);

  expect(screen.getByTestId("point").textContent).toMatch(/5.2/);
  expect(screen.getByTestId("theme").textContent).toMatch(/No theme/);
  expect(screen.getByTestId("date").textContent).toMatch(/2023\/01\/01 10:01:02/);
});

test("render with theme", () => {
  render(<RoundHistory id="id" theme="a theme" finishedAt={"2023-01-01T10:01:02"} averagePoint={5.2} />);

  expect(screen.getByTestId("theme").textContent).toMatch(/a theme/);
});

test("handle click root", async () => {
  expect.assertions(1);

  render(
    <RoundHistory
      id="id"
      theme="a theme"
      finishedAt={"2023-01-01T10:01:02"}
      onClick={(id) => {
        expect(id).toBe("id");
      }}
      averagePoint={5.2}
    />
  );

  await userEvent.click(screen.getByTestId("root"));
});

test("show time string after clicked", async () => {
  render(<RoundHistory id="id" theme="a theme" finishedAt={"2023-01-01T05:01:02"} averagePoint={5.2} />);

  expect(screen.queryByText("05:01:02")?.classList.contains("hidden")).toBeTruthy();

  await userEvent.click(screen.getByTestId("time"));

  expect(screen.queryByText("05:01:02")).not.toBeNull();
});

test.each([
  ["2023-05-01T00:00:00", 12],
  ["2023-05-01T01:00:00", 1],
  ["2023-05-01T02:00:00", 2],
  ["2023-05-01T03:00:00", 3],
  ["2023-05-01T04:00:00", 4],
  ["2023-05-01T05:00:00", 5],
  ["2023-05-01T06:00:00", 6],
  ["2023-05-01T07:00:00", 7],
  ["2023-05-01T08:00:00", 8],
  ["2023-05-01T09:00:00", 9],
  ["2023-05-01T10:00:00", 10],
  ["2023-05-01T11:00:00", 11],
  ["2023-05-01T12:00:00", 12],
  ["2023-05-01T13:00:00", 1],
  ["2023-05-01T14:00:00", 2],
  ["2023-05-01T15:00:00", 3],
  ["2023-05-01T16:00:00", 4],
  ["2023-05-01T17:00:00", 5],
  ["2023-05-01T18:00:00", 6],
  ["2023-05-01T19:00:00", 7],
  ["2023-05-01T20:00:00", 8],
  ["2023-05-01T21:00:00", 9],
  ["2023-05-01T22:00:00", 10],
  ["2023-05-01T23:00:00", 11],
])("show clock icon that matchs hours of datetime", async (date, expected) => {
  render(<RoundHistory id="id" theme="a theme" finishedAt={date} averagePoint={5.2} />);

  expect(screen.getByTestId("time").className).toContain(`clock-hour-${expected}.svg`);
});
