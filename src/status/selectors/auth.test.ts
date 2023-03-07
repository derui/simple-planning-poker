import { test, expect } from "vitest";
import { tryAuthenticate } from "../actions/signin";
import { createPureStore } from "../store";
import * as s from "./auth";

test("not authenticating with initial state", () => {
  const store = createPureStore();

  const ret = s.selectAuthenticating()(store.getState());

  expect(ret).toBe(false);
});

test("authenticating with some authentication is progress", () => {
  const store = createPureStore();
  store.dispatch(tryAuthenticate());

  const ret = s.selectAuthenticating()(store.getState());

  expect(ret).toBe(true);
});
