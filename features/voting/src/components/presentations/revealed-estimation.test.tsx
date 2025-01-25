import { act, cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach, beforeEach } from "vitest";
import { RevealedEstimation } from "./revealed-estimation.js";
import { SinonFakeTimers } from "sinon";
import sinon from "sinon";

let fakeTimer: SinonFakeTimers;

beforeEach(() => {
  fakeTimer = sinon.useFakeTimers();
});

afterEach(cleanup);
afterEach(() => {
  fakeTimer.restore();
});

test("display player card as normal and not opened", () => {
  render(<RevealedEstimation name="user">5</RevealedEstimation>);

  expect(screen.queryByText("5")).toBeNull();
});

test("should not be opened just mounted", async () => {
  const { container } = render(<RevealedEstimation name="user">5</RevealedEstimation>);

  await act(async () => {});

  expect(container.querySelector('[data-opened="false"]')).not.toBeNull();
});

test("open mounded card after 200ms ticked", async () => {
  const { container } = render(<RevealedEstimation name="user">5</RevealedEstimation>);

  fakeTimer.tick(201);

  await act(async () => {});

  expect(container.querySelector('[data-opened="true"]')).not.toBeNull();
});
