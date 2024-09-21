import { expect, test } from "vitest";
import { createFacade } from "./facade.js";
import { renderHook } from "@testing-library/react";

test("pass implementation", () => {
  // Arrange
  type T = {
    useAString(): string;
  };

  const { hooks, ImplementationProvider } = createFacade<T>();
  const mock: T = {
    useAString() {
      return "foo";
    },
  };

  // Act
  const { result } = renderHook(() => hooks.useAString(), {
    wrapper: ({ children }) => <ImplementationProvider implementation={mock}>{children}</ImplementationProvider>,
  });

  // Assert
  expect(result.current).toEqual("foo");
});

test("should throw error when do not provide implementation", () => {
  // Arrange
  type T = {
    useAString(): string;
  };

  const { hooks, ImplementationProvider } = createFacade<T>();

  // Act

  // Assert
  expect(() => renderHook(() => hooks.useAString())).toThrowErrorMatchingSnapshot();
});
