import { test, expect } from "vitest";
import { createPureStore } from "../store";
import { notifyRoundUpdated } from "../actions/round";
import * as s from "./round";
import * as Loadable from "@/utils/loadable";
import { randomRound } from "@/test-lib";

test("return loading when no round", () => {
  const store = createPureStore();

  const ret = s.selectRoundInformation()(store.getState());

  expect(ret).toEqual(Loadable.loading());
});

test("return theme after loaded", () => {
  const store = createPureStore();

  store.dispatch(notifyRoundUpdated(randomRound({ theme: "new theme" })));

  const ret = s.selectRoundInformation()(store.getState());

  expect(ret[0]).toEqual({ theme: "new theme", finished: false });
});
