import { User } from "@spp/shared-domain";
import { newMemoryUserRepository } from "@spp/shared-domain/mock/user-repository";
import { newChangeUserNameUseCase } from "@spp/shared-use-case";
import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";
import sinon from "sinon";
import { expect, test } from "vitest";
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
