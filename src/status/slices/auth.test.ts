import { test, expect } from "vitest";
import {
  signIn,
  signInFailure,
  signInSuccess,
  signUp,
  signUpFailure,
  signUpSuccess,
  tryAuthenticate,
  tryAuthenticateFailure,
  tryAuthenticateSuccess,
} from "../actions/signin";
import { getInitialState, reducer } from "./auth";
import * as User from "@/domains/user";

const USER = User.create({
  id: User.createId(),
  name: "name",
});

test("initial state", () => {
  expect(getInitialState()).toEqual({ progress: "unauthenticated", authenticating: false });
});

test("tryAuthentication successed", () => {
  let state = reducer(getInitialState(), tryAuthenticate());
  state = reducer(state, tryAuthenticateSuccess({ user: USER }));

  expect(state.progress).toBe("authenticated");
});

test("tryAuthentication failed", () => {
  let state = reducer(getInitialState(), tryAuthenticate());
  state = reducer(state, tryAuthenticateFailure());

  expect(state.progress).toBe("failed");
});

test("can not accept tryAuthenticateSuccess before tryAuthenticate", () => {
  const state = reducer(getInitialState(), tryAuthenticateSuccess({ user: USER }));

  expect(state.progress).toBe("unauthenticated");
});

test("sign in succeeded", () => {
  let state = reducer(getInitialState(), signIn({ email: "mail", password: "pass" }));
  state = reducer(state, signInSuccess({ user: USER }));

  expect(state.progress).toBe("authenticated");
});

test("sign in failed", () => {
  let state = reducer(getInitialState(), signIn({ email: "mail", password: "pass" }));
  state = reducer(state, signInFailure());

  expect(state.progress).toBe("failed");
});

test("sign up succeeded", () => {
  let state = reducer(getInitialState(), signUp({ email: "mail", password: "pass" }));
  state = reducer(state, signUpSuccess({ user: USER }));

  expect(state.progress).toBe("authenticated");
});

test("sign up failed", () => {
  let state = reducer(getInitialState(), signUp({ email: "mail", password: "pass" }));
  state = reducer(state, signUpFailure());

  expect(state.progress).toBe("failed");
});
