import { expect, test } from "vitest";
import { signInSuccess, signUpSuccess, tryAuthenticateSuccess } from "../actions/signin";
import { changeNameSuccess } from "../actions/user";
import { getInitialState, reducer } from "./user";
import * as User from "@/domains/user";

test("initial state", () => {
  expect(getInitialState()).toEqual({
    currentUser: null,
    users: {},
  });
});

test("put current user if authentication did succeed", () => {
  const user = User.create({
    id: User.createId(),
    name: "name",
  });

  const state = reducer(getInitialState(), tryAuthenticateSuccess(user));

  expect(state.currentUser).toEqual(user);
  expect(state.users).toEqual({ [user.id]: user });
});

test("put current user if sign-in did succeed", () => {
  const user = User.create({
    id: User.createId(),
    name: "name",
  });

  const state = reducer(getInitialState(), signInSuccess(user));

  expect(state.currentUser).toEqual(user);
  expect(state.users).toEqual({ [user.id]: user });
});

test("put current user if sign-up did succeed", () => {
  const user = User.create({
    id: User.createId(),
    name: "name",
  });

  const state = reducer(getInitialState(), signUpSuccess(user));

  expect(state.currentUser).toEqual(user);
  expect(state.users).toEqual({ [user.id]: user });
});

test("change name does not affect when current user is not set", () => {
  const user = User.create({
    id: User.createId(),
    name: "name",
  });

  const state = reducer(getInitialState(), changeNameSuccess(user));

  expect(state.currentUser).toBeNull();
});

test("get changed user when current user set-upped", () => {
  const user = User.create({
    id: User.createId(),
    name: "name",
  });

  let state = reducer(getInitialState(), signUpSuccess(user));
  state = reducer(state, changeNameSuccess(User.changeName(user, "foobar")[0]));

  expect(state.currentUser?.name).toEqual("foobar");
});
