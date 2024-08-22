import { test, expect } from "vitest";
import { somethingFailure } from "../actions/round";
import { createPureStore } from "../store";
import * as s from "./error";

test("return empty list with no errors", () => {
  const store = createPureStore();

  const ret = s.selectErrorMessages(store.getState());

  expect(ret).toHaveLength(0);
});

test("return errros with error", () => {
  const store = createPureStore();
  store.dispatch(somethingFailure({ reason: "failed" }));
  store.dispatch(somethingFailure({ reason: "failed2" }));

  const ret = s.selectErrorMessages(store.getState());

  expect(ret).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ type: "alert", content: "failed" }),
      expect.objectContaining({ type: "alert", content: "failed2" }),
    ])
  );
});
