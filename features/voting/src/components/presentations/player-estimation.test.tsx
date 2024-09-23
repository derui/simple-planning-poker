import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { PlayerEstimation } from "./player-estimation.js";

afterEach(cleanup);

test("display player card as normal and not opened", async () => {
  render(
    <PlayerEstimation name="user" state="notSelected" mode="player">
      5
    </PlayerEstimation>
  );

  expect(screen.queryByText("5")).toBeNull();
});

test("display player card as inspector", async () => {
  const { container } = render(
    <PlayerEstimation name="user" state="notSelected" mode="inspector">
      5
    </PlayerEstimation>
  );

  expect(container.querySelector('[data-mode="inspector"]')).not.toBeNull();
});

test("selected card", async () => {
  const { container } = render(
    <PlayerEstimation name="user" state="estimated" mode="player">
      5
    </PlayerEstimation>
  );

  expect(container.querySelector("[data-state='estimated']")).not.toBeNull();
});

test("opened card that user not selected", async () => {
  const { container } = render(
    <PlayerEstimation name="user" state="notSelected" mode="player">
      5
    </PlayerEstimation>
  );

  expect(container.querySelector('[data-state="notSelected"]')).not.toBeNull();
});

test("opened card that user selected", async () => {
  const { container } = render(
    <PlayerEstimation name="user" state="revealed" mode="player">
      5
    </PlayerEstimation>
  );

  expect(container.querySelector("[data-state='revealed']")).not.toBeNull();
  expect(screen.queryByText("5")).not.toBeNull();
});
