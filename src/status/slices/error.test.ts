import { test, expect } from "vitest";
import { clearError, showMessage } from "../actions/common";
import { somethingFailure } from "../actions/round";
import { tryAuthenticateFailure } from "../actions/signin";
import { getInitialState, reducer } from "./error";

test("initial state", () => {
  expect(getInitialState()).toEqual({ errors: {} });
});

test("store error with failure", () => {
  let state = reducer(getInitialState(), somethingFailure({ reason: "failed1" }));
  state = reducer(state, tryAuthenticateFailure({ reason: "failed2" }));

  expect(
    Object.values(state.errors)
      .map((v) => v.content)
      .sort()
  ).toEqual(expect.arrayContaining(["failed1", "failed2"]));
  expect(
    Object.values(state.errors)
      .map((v) => v.type)
      .sort()
  ).toEqual(expect.arrayContaining(["alert", "alert"]));
});

test("clear error with id", () => {
  let state = reducer(getInitialState(), somethingFailure({ reason: "failed1" }));
  state = reducer(state, clearError(Object.keys(state.errors)[0]));

  expect(state).toEqual({ errors: {} });
});

test("store information with message", () => {
  let state = reducer(getInitialState(), showMessage("message"));

  expect(
    Object.values(state.errors)
      .map((v) => v.content)
      .sort()
  ).toEqual(expect.arrayContaining(["message"]));
  expect(
    Object.values(state.errors)
      .map((v) => v.type)
      .sort()
  ).toEqual(expect.arrayContaining(["info"]));
});
