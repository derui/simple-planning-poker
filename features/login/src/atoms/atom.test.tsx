import { describe, expect, test } from "vitest";
import { createUseLogin, useAuth } from "./atom.js";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { newMemoryAuthenticator } from "@spp/infra-authenticator/memory.js";
import { newMemoryUserRepository } from "@spp/shared-domain/mock/user-repository";
import { User } from "@spp/shared-domain";

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

describe("UseAuth", () => {
  test("all status points not logined", () => {
    // Arrange
    const store = createStore();

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(store) });

    // Assert
    expect(result.current.currentUserId).toBeUndefined();
    expect(result.current.logined).toBeFalsy();
  });

  test("logined status", async () => {
    // Arrange
    const authenticator = newMemoryAuthenticator(newMemoryUserRepository());

    const store = createStore();
    const wrapper = createWrapper(store);
    const login = renderHook(() => createUseLogin(authenticator)(), { wrapper });

    login.result.current.signUp("test@example.com", "foo");

    await waitFor(() => Promise.resolve());

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Assert
    expect(result.current.currentUserId).not.toBeUndefined();
    expect(result.current.logined).toBeTruthy();
  });
});

describe("UseLogin", () => {
  test("set logined as login state after sign up", async () => {
    // Arrange
    const authenticator = newMemoryAuthenticator(newMemoryUserRepository());

    const store = createStore();
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(() => createUseLogin(authenticator)(), { wrapper });

    result.current.signUp("test@example.com", "foo");

    await waitFor(() => Promise.resolve());

    // Assert
    expect(result.current.status).toEqual("logined");
  });

  test("set notLogined before any sign in/up command", async () => {
    // Arrange
    const authenticator = newMemoryAuthenticator(newMemoryUserRepository());

    const store = createStore();
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(() => createUseLogin(authenticator)(), { wrapper });

    // Assert
    expect(result.current.status).toEqual("notLogined");
  });

  test("set doing while sign up", async () => {
    // Arrange
    const authenticator = newMemoryAuthenticator(newMemoryUserRepository());

    const store = createStore();
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(() => createUseLogin(authenticator)(), { wrapper });

    act(() => result.current.signUp("test@example.com", "password"));

    // Assert
    expect(result.current.status).toEqual("doing");
  });

  test("set doing while sign in", async () => {
    // Arrange
    const authenticator = newMemoryAuthenticator(
      newMemoryUserRepository([User.create({ id: User.createId("test/pass"), name: "test" })])
    );

    const store = createStore();
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(() => createUseLogin(authenticator)(), { wrapper });

    act(() => result.current.signIn("test@example.com", "password"));

    // Assert
    expect(result.current.status).toEqual("doing");
  });

  test("set error if error occurred", async () => {
    // Arrange
    const authenticator = newMemoryAuthenticator(newMemoryUserRepository());

    const store = createStore();
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(() => createUseLogin(authenticator)(), { wrapper });

    act(() => result.current.signIn("test@example.com", "password"));
    await waitFor(() => Promise.resolve());

    // Assert
    expect(result.current.status).toEqual("notLogined");
    expect(result.current.loginError).toEqual("Email or password is invalid");
  });
});
