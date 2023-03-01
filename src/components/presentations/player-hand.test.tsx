import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import PlayerHandComponent from "./player-hand";

afterEach(cleanup);

test("display player card as normal and not opened", async () => {
  render(<PlayerHandComponent userName="user" displayValue="5" selected={false} userMode="normal" opened={false} />);

  expect(screen.queryByTestId("card")).not.toBeNull();
  expect(screen.queryByTestId("eye")).toBeNull();
  expect(screen.queryByText("5")).toBeNull();
  expect(screen.queryByText("user")).not.toBeNull();
});

test("display player card as inspector", async () => {
  render(<PlayerHandComponent userName="user" displayValue="5" selected={false} userMode="inspector" opened={false} />);

  expect(screen.queryByTestId("card")).not.toBeNull();
  expect(screen.queryByTestId("eye")).not.toBeNull();
});

test("selected card", async () => {
  render(<PlayerHandComponent userName="user" displayValue="5" selected={true} userMode="normal" opened={false} />);

  expect(screen.getByTestId("card").dataset).toHaveProperty("state", "handed");
});

test("opened card that user not selected", async () => {
  render(<PlayerHandComponent userName="user" displayValue="5" selected={false} userMode="normal" opened={true} />);

  expect(screen.getByTestId("card").dataset).toHaveProperty("state", "notSelected");
});

test("opened card that user selected", async () => {
  render(<PlayerHandComponent userName="user" displayValue="5" selected={true} userMode="normal" opened={true} />);

  expect(screen.getByTestId("card").dataset).toHaveProperty("state", "result");
  expect(screen.queryByText("5")).not.toBeNull();
});
