import { resetLoggedInUser } from "@spp/infra-authenticator/memory";
import { User } from "@spp/shared-domain";
import { clear } from "@spp/shared-domain/mock/user-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { beforeEach, describe, expect, test } from "vitest";
import { useLogin } from "./use-login.js";

beforeEach(() => {
  clear();
  resetLoggedInUser();
});

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

describe("UseLogin", () => {
  test("set logined as login state after sign up", async () => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(() => useLogin(), { wrapper });

    result.current.signUp("test@example.com", "foo");

    await waitFor(() => Promise.resolve());

    // Assert
    expect(result.current.status).toEqual("logined");
  });

  test("set notLogined before any sign in/up command", () => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(() => useLogin(), { wrapper });

    // Assert
    expect(result.current.status).toEqual("notLogined");
  });

  test("set doing while sign up", () => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => result.current.signUp("test@example.com", "password"));

    // Assert
    expect(result.current.status).toEqual("doing");
  });

  test("set doing while sign in", async () => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);

    await UserRepository.save({ user: User.create({ id: User.createId("test/pass"), name: "test" }) });

    // Act
    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => result.current.signIn("test@example.com", "password"));

    // Assert
    expect(result.current.status).toEqual("doing");
  });

  test("set error if error occurred", async () => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => result.current.signIn("test@example.com", "password"));
    await waitFor(() => Promise.resolve());

    // Assert
    expect(result.current.status).toEqual("notLogined");
    expect(result.current.loginError).toEqual("Email or password is invalid");
  });
});
