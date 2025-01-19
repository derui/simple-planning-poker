import { Game, StoryPoint } from "@spp/shared-domain";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { beforeEach, expect, test } from "vitest";
import { useVoting } from "./use-voting.js";

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

test("initial status", async () => {
  // Arrange
  const store = createStore();

  // Act
  const { result } = renderHook(useVoting, {
    wrapper: createWrapper(store),
  });

  // Assert
  expect(result.current.selectedPoint).toBeUndefined();
});

test("select a story point", async () => {
  // Arrange
  const store = createStore();
  const point = StoryPoint.create(3);

  // Act
  const { result } = renderHook(useVoting, {
    wrapper: createWrapper(store),
  });

  act(() => {
    result.current.select(point);
  });

  // Assert
  expect(result.current.selectedPoint).toEqual(point);
});

test("reset selected story point", async () => {
  // Arrange
  const store = createStore();
  const point = StoryPoint.create(3);

  // Act
  const { result } = renderHook(useVoting, {
    wrapper: createWrapper(store),
  });

  act(() => {
    result.current.select(point);
    result.current.reset();
  });

  // Assert
  expect(result.current.selectedPoint).toBeUndefined();
});
