import { resetLoggedInUser, setLoggedUser } from "@spp/infra-authenticator/memory";
import { User } from "@spp/shared-domain";
import { renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { beforeEach, describe, expect, test } from "vitest";
import { useLoginUser } from "./use-login-user.js";

beforeEach(() => {
  resetLoggedInUser();
});

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

describe("UseLoginUser", () => {
  test("return undefined before authentication", () => {
    // Arrange
    const store = createStore();

    // Act
    const { result } = renderHook(() => useLoginUser(), { wrapper: createWrapper(store) });

    // Assert
    expect(result.current.userId).toBeUndefined();
  });

  test("authenticated status", async () => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);
    setLoggedUser(User.createId("foo"));

    // Act
    const { result, rerender } = renderHook(() => useLoginUser(), { wrapper });
    result.current.loginUser(User.createId("foo"));
    rerender();

    // Assert
    expect(result.current.userId).toEqual(User.createId("foo"));
  });
});
