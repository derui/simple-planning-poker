import { User, VoterType } from "@spp/shared-domain";
import { newMemoryUserRepository } from "@spp/shared-domain/mock/user-repository";
import { newChangeDefaultVoterTypeUseCase, newChangeUserNameUseCase } from "@spp/shared-use-case";
import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";
import sinon from "sinon";
import { expect, test } from "vitest";
import { VoterMode } from "../components/type.js";
import { createUseUserHeader } from "./user-header.js";

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

test("initial status", () => {
  // Arrange
  const store = createStore();
  const userRepository = newMemoryUserRepository();

  // Act
  const { result } = renderHook(
    () =>
      createUseUserHeader({
        useLoginUser: sinon.fake.returns({ userId: undefined }),
        userRepository: userRepository,
        changeUserNameUseCase: newChangeUserNameUseCase(sinon.fake(), userRepository),
        changeDefaultVoterModeUseCase: sinon.fake(),
      })(),
    {
      wrapper: createWrapper(store),
    }
  );

  // Assert
  expect(result.current.loginUser).toBeUndefined();
  expect(result.current.status).toBe("loading");
});

test("get user information after effect", async () => {
  // Arrange
  const repository = newMemoryUserRepository([
    User.create({
      id: User.createId("user"),
      name: "User",
    }),
  ]);
  const store = createStore();
  const wrapper = createWrapper(store);

  // Act
  const { result, rerender } = renderHook(
    createUseUserHeader({
      useLoginUser: sinon.fake.returns({ userId: User.createId("user") }),
      userRepository: repository,
      changeUserNameUseCase: newChangeUserNameUseCase(sinon.fake(), repository),
      changeDefaultVoterModeUseCase: sinon.fake(),
    }),
    { wrapper }
  );

  // Wait a promise
  await act(async () => {});
  rerender();

  // Assert
  expect(result.current.loginUser).toEqual({ id: "user", name: "User" });
  expect(result.current.status).toEqual("loaded");
});

test("change name after call use case", async () => {
  // Arrange
  const repository = newMemoryUserRepository([
    User.create({
      id: User.createId("user"),
      name: "User",
    }),
  ]);
  const store = createStore();
  const wrapper = createWrapper(store);

  // Act
  const { result, rerender } = renderHook(
    createUseUserHeader({
      useLoginUser: sinon.fake.returns({ userId: User.createId("user") }),
      userRepository: repository,
      changeUserNameUseCase: newChangeUserNameUseCase(sinon.fake(), repository),
      changeDefaultVoterModeUseCase: sinon.fake(),
    }),
    { wrapper }
  );
  // Wait a promise
  await act(async () => {});
  result.current.editName("new name");

  await act(async () => {});
  rerender();

  // Assert
  expect(result.current.loginUser).toEqual({ id: "user", name: "new name" });
  expect(result.current.status).toBe("edited");
});

test("should be able to change default voter type of the user", async () => {
  // Arrange
  const store = createStore();
  const wrapper = createWrapper(store);
  const repository = newMemoryUserRepository([
    User.create({ id: User.createId("user"), name: "name", defaultVoterType: VoterType.Inspector }),
  ]);
  const { result, rerender } = renderHook(
    createUseUserHeader({
      useLoginUser: sinon.fake.returns({ userId: User.createId("user") }),
      userRepository: repository,
      changeUserNameUseCase: sinon.fake(),
      changeDefaultVoterModeUseCase: newChangeDefaultVoterTypeUseCase(repository),
    }),
    {
      wrapper,
    }
  );

  // Act
  await act(async () => {});
  result.current.changeDefaultVoterMode(VoterMode.Normal);

  await act(async () => {});
  rerender();

  // Assert
  expect(result.current.loginUser).toEqual({ id: "user", name: "name" });
  expect(result.current.status).toBe("edited");
});

test("get current voter mode", async () => {
  // Arrange
  const store = createStore();
  const wrapper = createWrapper(store);
  const repository = newMemoryUserRepository([
    User.create({ id: User.createId("user"), name: "name", defaultVoterType: VoterType.Inspector }),
  ]);
  const { result, rerender } = renderHook(
    createUseUserHeader({
      useLoginUser: sinon.fake.returns({ userId: User.createId("user") }),
      userRepository: repository,
      changeUserNameUseCase: sinon.fake(),
      changeDefaultVoterModeUseCase: newChangeDefaultVoterTypeUseCase(repository),
    }),
    {
      wrapper,
    }
  );

  // Act
  await act(async () => {});
  const current = result.current.voterMode;
  result.current.changeDefaultVoterMode(VoterMode.Normal);

  await act(async () => {});
  rerender();
  const changed = result.current.voterMode;

  // Assert
  expect(current).toBe(VoterMode.Inspector);
  expect(changed).toBe(VoterMode.Normal);
});
