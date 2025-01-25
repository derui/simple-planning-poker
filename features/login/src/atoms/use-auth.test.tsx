import { resetLoggedInUser, setLoggedUser } from "@spp/infra-authenticator/memory";
import { User } from "@spp/shared-domain";
import { clear } from "@spp/shared-domain/mock/user-repository";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { beforeEach, describe, expect, test } from "vitest";
import { useAuth } from "./use-auth.js";

beforeEach(() => {
  clear();
  resetLoggedInUser();
});

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
    expect(result.current.status).toEqual("notAuthenticated");
  });

  test("authenticated status", async () => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);
    setLoggedUser(User.createId("foo"));

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => result.current.checkLogined());

    await waitFor(() => Promise.resolve());

    // Assert
    expect(result.current.status).toEqual("authenticated");
  });

  test("checking status", () => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => result.current.checkLogined());

    // Assert
    expect(result.current.status).toEqual("checking");
  });
});
