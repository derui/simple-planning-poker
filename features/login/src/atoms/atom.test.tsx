import { describe, expect, test } from "vitest";
import { createUseLogin, createUseAuth, createUseLoginUser } from "./atom.js";
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
    const authenticator = newMemoryAuthenticator(newMemoryUserRepository());
    const store = createStore();

    // Act
    const { result } = renderHook(() => createUseAuth(authenticator)(), { wrapper: createWrapper(store) });

    // Assert
    expect(result.current.status).toEqual("notAuthenticated");
  });

  test("authenticated status", async () => {
    // Arrange
    const authenticator = newMemoryAuthenticator(newMemoryUserRepository(), User.createId("foo"));

    const store = createStore();
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(() => createUseAuth(authenticator)(), { wrapper });

    act(() => result.current.checkLogined());

    await waitFor(() => Promise.resolve());

    // Assert
    expect(result.current.status).toEqual("authenticated");
  });

  test("checking status", () => {
    // Arrange
    const authenticator = newMemoryAuthenticator(newMemoryUserRepository(), User.createId("foo"));

    const store = createStore();
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(() => createUseAuth(authenticator)(), { wrapper });

    act(() => result.current.checkLogined());

    // Assert
    expect(result.current.status).toEqual("checking");
  });
});

describe("UseLoginUser", () => {
  test("return undefined before authentication", () => {
    // Arrange
    const store = createStore();

    // Act
    const { result } = renderHook(() => createUseLoginUser()(), { wrapper: createWrapper(store) });

    // Assert
    expect(result.current.userId).toBeUndefined();
  });

  test("authenticated status", async () => {
    // Arrange
    const authenticator = newMemoryAuthenticator(newMemoryUserRepository(), User.createId("foo"));

    const store = createStore();
    const wrapper = createWrapper(store);

    // Act
    const auth = renderHook(() => createUseAuth(authenticator)(), { wrapper });

    act(() => auth.result.current.checkLogined());

    await waitFor(() => Promise.resolve());

    const { result } = renderHook(() => createUseLoginUser()(), { wrapper });

    // Assert
    expect(result.current.userId).toEqual(User.createId("foo"));
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

  test("set notLogined before any sign in/up command", () => {
    // Arrange
    const authenticator = newMemoryAuthenticator(newMemoryUserRepository());

    const store = createStore();
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(() => createUseLogin(authenticator)(), { wrapper });

    // Assert
    expect(result.current.status).toEqual("notLogined");
  });

  test("set doing while sign up", () => {
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

  test("set doing while sign in", () => {
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
