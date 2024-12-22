import { useLoginUser } from "@spp/feature-login";
import { User, VoterType } from "@spp/shared-domain";
import { clear } from "@spp/shared-domain/mock/user-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";
import { beforeEach, expect, test, vi } from "vitest";
import { VoterMode } from "../components/type.js";
import { useUserInfo } from "./use-user-info.js";

vi.mock(import("@spp/feature-login"), async (importOriginal) => {
  const mod = await importOriginal();

  return {
    ...mod,
    useLoginUser: vi.fn(),
  };
});

beforeEach(() => {
  clear();

  vi.mocked(useLoginUser).mockReturnValue({
    userId: User.createId("id"),
    checkLoggedIn: vi.fn(),
    loginUser: vi.fn(),
  });
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

test("get user information after effect", async () => {
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
  await act(async () => {});
  rerender();

  // Assert
  expect(result.current.loginUser).toEqual({ id: "id", name: "User" });
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
  await act(async () => {});
  await act(async () => result.current.editName("new name"));
  rerender();

  // Assert
  expect(result.current.loginUser).toEqual({ id: "id", name: "new name" });
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
  await act(async () => {});
  await act(async () => {
    result.current.changeDefaultVoterMode(VoterMode.Normal);
  });
  rerender();

  // Assert
  expect(result.current.loginUser).toEqual({ id: "id", name: "name" });
  expect(result.current.loading).toBe(false);
});

test("get current voter mode", async () => {
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
  await act(async () => {});
  const current = result.current.voterMode;
  await act(async () => {
    result.current.changeDefaultVoterMode(VoterMode.Normal);
  });
  rerender();
  const changed = result.current.voterMode;

  // Assert
  expect(current).toBe(VoterMode.Inspector);
  expect(changed).toBe(VoterMode.Normal);
});
