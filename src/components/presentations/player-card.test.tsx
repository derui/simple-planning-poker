import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import PlayerCardComponent from "./player-card";

afterEach(cleanup);

test("display player card as normal and not opened", async () => {
  render(<PlayerCardComponent display="5" selected={false} mode="normal" opened={false} />);

  expect(screen.queryByTestId("root")).not.toBeNull();
  expect(screen.queryByTestId("eye")).toBeNull();
  expect(screen.queryByText("5")).toBeNull();
});

test("display player card as inspector", async () => {
  render(<PlayerCardComponent display="5" selected={false} mode="inspector" opened={false} />);

  expect(screen.queryByTestId("root")).not.toBeNull();
  expect(screen.queryByTestId("eye")).not.toBeNull();
});

test("selected card", async () => {
  render(<PlayerCardComponent display="5" selected={true} mode="normal" opened={false} />);

  expect(screen.getByTestId("root").dataset).toHaveProperty("state", "handed");
});

test("opened card that user not selected", async () => {
  render(<PlayerCardComponent display="5" selected={false} mode="normal" opened={true} />);

  expect(screen.getByTestId("root").dataset).toHaveProperty("state", "notSelected");
});

test("opened card that user selected", async () => {
  render(<PlayerCardComponent display="5" selected={true} mode="normal" opened={true} />);

  expect(screen.getByTestId("root").dataset).toHaveProperty("state", "result");
  expect(screen.queryByText("5")).not.toBeNull();
});
