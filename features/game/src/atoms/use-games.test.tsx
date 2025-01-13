import { ApplicablePoints, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { clear as clearGame } from "@spp/shared-domain/mock/game-repository";
import { clear as clearUser } from "@spp/shared-domain/mock/user-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { renderHook, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";
import { beforeEach, expect, test } from "vitest";
import { useGames } from "./use-games.js";
import { loadUserAtom } from "./user-atom.js";

beforeEach(() => {
  clearGame();
  clearUser();
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
  await UserRepository.save({
    user: User.create({
      id: User.createId("id"),
      name: "name",
    }),
  });

  const game = Game.create({
    id: Game.createId(),
    owner: User.createId("id"),
    points: ApplicablePoints.create([StoryPoint.create(3)]),
    name: GameName.create("game"),
  })[0];

  await GameRepository.save({ game });
  const store = createStore();
  const wrapper = createWrapper(store);
  store.set(loadUserAtom, User.createId("id"));

  // Act
  const { result, rerender } = renderHook(useGames, { wrapper });

  // Wait a promise
  await waitFor(async () => !result.current.loading);
  rerender();

  // Assert
  expect(result.current.games).toHaveLength(1);
});
