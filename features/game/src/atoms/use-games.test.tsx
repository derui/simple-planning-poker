import { useLoginUser } from "@spp/feature-login";
import { ApplicablePoints, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { clear } from "@spp/shared-domain/mock/game-repository";
import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";
import { beforeEach, expect, test, vi } from "vitest";
import { useGames } from "./use-games.js";

vi.mock(import("@spp/feature-login"), async (importOriginal) => {
  const mod = await importOriginal();

  return {
    ...mod,
    useLoginUser: vi.fn(),
  };
});

beforeEach(() => {
  clear();

  vi.mocked(useLoginUser).mockReturnValue({
    userId: User.createId("id"),
    checkLoggedIn: vi.fn(),
    loginUser: vi.fn(),
  });
});

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

test("initial status", () => {
  // Arrange
  const store = createStore();

  // Act
  const { result } = renderHook(useGames, {
    wrapper: createWrapper(store),
  });

  // Assert
  expect(result.current.games).toHaveLength(0);
  expect(result.current.loading).toBe(true);
});

test("get games after effect", async () => {
  // Arrange
  const game = Game.create({
    id: Game.createId(),
    owner: User.createId("id"),
    points: ApplicablePoints.create([StoryPoint.create(3)]),
    name: GameName.create("game"),
  })[0];

  await GameRepository.save({ game });
  const store = createStore();
  const wrapper = createWrapper(store);

  // Act
  const { result, rerender } = renderHook(useGames, { wrapper });

  // Wait a promise
  await act(async () => {});
  rerender();

  // Assert
  expect(result.current.games).toHaveLength(1);
});
