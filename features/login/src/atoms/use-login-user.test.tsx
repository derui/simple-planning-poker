import { resetLoggedInUser, setLoggedUser } from "@spp/infra-authenticator/memory";
import { User } from "@spp/shared-domain";
import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { beforeEach, describe, expect, test } from "vitest";
import { checkLoginedAtom } from "./atom.js";
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
    store.set(checkLoginedAtom);

    // Act
    const { result } = renderHook(() => useLoginUser(), { wrapper });
    await act(async () => {});

    // Assert
    expect(result.current.userId).toEqual(User.createId("foo"));
  });
});
