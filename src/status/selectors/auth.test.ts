import { test, expect, describe } from "vitest";
import { tryAuthenticate, tryAuthenticateSuccess } from "../actions/signin";
import { createPureStore } from "../store";
import * as s from "./auth";
import { randomUser } from "@/test-lib";

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

describe("isAuthenticated", () => {
  test("return false with initial state", () => {
    const store = createPureStore();

    const ret = s.selectAuthenticated()(store.getState());

    expect(ret).toBe(false);
  });

  test("return false with authenticating", () => {
    const store = createPureStore();
    store.dispatch(tryAuthenticate());

    const ret = s.selectAuthenticated()(store.getState());

    expect(ret).toBe(false);
  });

  test("return true after authenticated", () => {
    const store = createPureStore();
    store.dispatch(tryAuthenticate());
    store.dispatch(tryAuthenticateSuccess({ user: randomUser({}) }));

    const ret = s.selectAuthenticated()(store.getState());

    expect(ret).toBe(true);
  });
});
