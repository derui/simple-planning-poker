import { ApplicablePoints, Game, StoryPoint, User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";
import sinon from "sinon";
import { expect, test } from "vitest";
import { createUseListGames } from "./list-games.js";

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

test("initial status", () => {
  // Arrange
  const store = createStore();

  // Act
  const { result } = renderHook(
    () =>
      createUseListGames({
        gameRepository: newMemoryGameRepository(),
        useLoginUser: sinon.fake.returns({ userId: undefined }),
      })(),
    {
      wrapper: createWrapper(store),
    }
  );

  // Assert
  expect(result.current.games).toHaveLength(0);
  expect(result.current.status).toBe("loading");
});

test("get games after effect", async () => {
  // Arrange
  const repository = newMemoryGameRepository([
    Game.create({
      id: Game.createId(),
      owner: User.createId("id"),
      points: ApplicablePoints.create([StoryPoint.create(3)]),
      name: "game",
    })[0],
  ]);
  const store = createStore();
  const wrapper = createWrapper(store);

  // Act
  const { result, rerender } = renderHook(
    createUseListGames({
      gameRepository: repository,
      useLoginUser: sinon.fake.returns({ userId: User.createId("id") }),
    }),
    { wrapper }
  );

  // Wait a promise
  await act(async () => {});
  rerender();

  // Assert
  expect(result.current.games).toHaveLength(1);
});

test("Request to create game", async () => {
  // Arrange
  const gameId = Game.createId("game");
  const repository = newMemoryGameRepository([
    Game.create({
      id: gameId,
      owner: User.createId("id"),
      points: ApplicablePoints.create([StoryPoint.create(3)]),
      name: "game",
    })[0],
  ]);
  const store = createStore();
  const wrapper = createWrapper(store);
  const { result, rerender } = renderHook(
    createUseListGames({
      gameRepository: repository,
      useLoginUser: sinon.fake.returns({ userId: User.createId("id") }),
    }),
    { wrapper }
  );
  await act(async () => {});

  // Act
  result.current.requestCreate();
  rerender();

  // Assert
  expect(result.current.status).toBe("creating");
});

test("select game", async () => {
  // Arrange
  const gameId = Game.createId("game");
  const game = Game.create({
    id: gameId,
    owner: User.createId("id"),
    points: ApplicablePoints.create([StoryPoint.create(3)]),
    name: "game name",
  })[0];
  const repository = newMemoryGameRepository([game]);
  const store = createStore();
  const wrapper = createWrapper(store);
  const { result, rerender } = renderHook(
    createUseListGames({
      gameRepository: repository,
      useLoginUser: sinon.fake.returns({ userId: User.createId("id") }),
    }),
    { wrapper }
  );
  await act(async () => {});

  // Act
  result.current.select("game");

  await act(async () => {});
  rerender();

  // Assert
  expect(result.current.selectedGame?.id).toEqual("game");
  expect(result.current.selectedGame?.name).toEqual("game name");
});
