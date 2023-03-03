import { test, expect } from "vitest";
import { error, finished, isError, isFinished, isLoading, loading } from "./type";

test("make loading", () => {
  const state = loading();

  expect(isLoading(state)).toBe(true);
  expect(isError(state)).toBe(false);
  expect(isFinished(state)).toBe(false);
});

test("make error", () => {
  const state = error();

  expect(isLoading(state)).toBe(false);
  expect(isError(state)).toBe(true);
  expect(isFinished(state)).toBe(false);
});

test("make finished", () => {
  const state = finished({});

  expect(isLoading(state)).toBe(false);
  expect(isError(state)).toBe(false);
  expect(isFinished(state)).toBe(true);
});
