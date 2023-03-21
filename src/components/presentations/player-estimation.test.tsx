import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { PlayerEstimation } from "./player-estimation";

afterEach(cleanup);

test("display player card as normal and not opened", async () => {
  render(<PlayerEstimation userName="user" displayValue="5" state="notSelected" userMode="normal" />);

  expect(screen.queryByTestId("card")).not.toBeNull();
  expect(screen.queryByTestId("eye")).toBeNull();
  expect(screen.queryByText("5")).toBeNull();
  expect(screen.queryByText("user")).not.toBeNull();
});

test("display player card as inspector", async () => {
  render(<PlayerEstimation userName="user" displayValue="5" state="notSelected" userMode="inspector" />);

  expect(screen.queryByTestId("card")).not.toBeNull();
  expect(screen.queryByTestId("eye")).not.toBeNull();
});

test("selected card", async () => {
  render(<PlayerEstimation userName="user" displayValue="5" state="handed" userMode="normal" />);

  expect(screen.getByTestId("card").dataset).toHaveProperty("state", "handed");
});

test("opened card that user not selected", async () => {
  render(<PlayerEstimation userName="user" displayValue="5" state="notSelected" userMode="normal" />);

  expect(screen.getByTestId("card").dataset).toHaveProperty("state", "notSelected");
});

test("opened card that user selected", async () => {
  render(<PlayerEstimation userName="user" displayValue="5" state="result" userMode="normal" />);

  expect(screen.getByTestId("card").dataset).toHaveProperty("state", "result");
  expect(screen.queryByText("5")).not.toBeNull();
});
