import { User, VoterType } from "@spp/shared-domain";
import { clear } from "@spp/shared-domain/mock/user-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";
import { beforeEach, expect, test } from "vitest";
import { VoterMode } from "../components/type.js";
import { useUserInfo } from "./use-user-info.js";

beforeEach(() => {
  clear();
});

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

test("initial status", () => {
  // Arrange
  const store = createStore();

  // Act
  const { result } = renderHook(useUserInfo, {
    wrapper: createWrapper(store),
  });

  // Assert
  expect(result.current.loginUser).toBeUndefined();
  expect(result.current.loading).toBe(true);
});

test("get user information after load", async () => {
  // Arrange
  await UserRepository.save({
    user: User.create({
      id: User.createId("id"),
      name: "User",
    }),
  });
  const store = createStore();
  const wrapper = createWrapper(store);

  // Act
  const { result, rerender } = renderHook(useUserInfo, { wrapper });

  // Wait a promise
  await act(async () => result.current.loadUser("id"));
  rerender();

  // Assert
  expect(result.current.loginUser).toEqual({ id: "id", name: "User", defaultVoterMode: VoterMode.Normal });
  expect(result.current.loading).toEqual(false);
});

test("change name after call use case", async () => {
  // Arrange
  await UserRepository.save({
    user: User.create({
      id: User.createId("id"),
      name: "User",
    }),
  });
  const store = createStore();
  const wrapper = createWrapper(store);

  // Act
  const { result, rerender } = renderHook(useUserInfo, { wrapper });
  // Wait a promise
  await act(async () => result.current.loadUser("id"));
  await act(async () => result.current.editName("new name"));
  rerender();

  // Assert
  expect(result.current.loginUser).toEqual({ id: "id", name: "new name", defaultVoterMode: VoterMode.Normal });
  expect(result.current.loading).toBe(false);
});

test("should be able to change default voter type of the user", async () => {
  // Arrange
  const store = createStore();
  const wrapper = createWrapper(store);
  await UserRepository.save({
    user: User.create({ id: User.createId("id"), name: "name", defaultVoterType: VoterType.Inspector }),
  });
  const { result, rerender } = renderHook(useUserInfo, {
    wrapper,
  });

  // Act
  await act(async () => result.current.loadUser("id"));
  await act(async () => {
    result.current.changeDefaultVoterMode(VoterMode.Normal);
  });
  rerender();

  // Assert
  expect(result.current.loginUser).toEqual({ id: "id", name: "name", defaultVoterMode: VoterMode.Normal });
  expect(result.current.loading).toBe(false);
});

test("get current voter mode", async () => {
  // Arrange
  const store = createStore();
  const wrapper = createWrapper(store);
  await UserRepository.save({
    user: User.create({ id: User.createId("id"), name: "name", defaultVoterType: VoterType.Normal }),
  });
  const { result, rerender } = renderHook(useUserInfo, {
    wrapper,
  });

  // Act
  await act(async () => result.current.loadUser("id"));
  await act(async () => {
    result.current.changeDefaultVoterMode(VoterMode.Inspector);
  });
  rerender();

  // Assert
  expect(result.current.loginUser).toEqual({ id: "id", name: "name", defaultVoterMode: VoterMode.Inspector });
});
