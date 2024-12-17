import { ApplicablePoints, Game, StoryPoint, User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { newDeleteGameUseCase } from "@spp/shared-use-case";
import { renderHook, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";
import sinon from "sinon";
import { expect, test } from "vitest";
import { toGameDto } from "./dto.js";
import { gamesAtom, GameStatus, gameStatusAtom, selectedGameAtom } from "./game-atom.js";
import { createUseGameDetail } from "./game-detail.js";

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

test("initial status", () => {
  // Arrange
  const store = createStore();

  // Act
  const { result } = renderHook(
    () =>
      createUseGameDetail({
        gameRepository: newMemoryGameRepository(),
        useLoginUser: sinon.fake.returns({ userId: undefined }),
        deleteGameUseCase: newDeleteGameUseCase(newMemoryGameRepository()),
      })(),
    {
      wrapper: createWrapper(store),
    }
  );

  // Assert
  expect(result.current.game).toBeUndefined();
  expect(result.current.loading).toBe(false);
});

test("get games after effect", async () => {
  // Arrange
  const game = Game.create({
    id: Game.createId(),
    owner: User.createId("id"),
    points: ApplicablePoints.create([StoryPoint.create(3)]),
    name: "game",
  })[0];
  const repository = newMemoryGameRepository([game]);
  const store = createStore();
  store.set(selectedGameAtom, game);

  const wrapper = createWrapper(store);

  // Act
  const { result } = renderHook(
    createUseGameDetail({
      gameRepository: repository,
      useLoginUser: sinon.fake.returns({ userId: User.createId("id") }),
      deleteGameUseCase: newDeleteGameUseCase(repository),
    }),
    { wrapper }
  );

  // Assert
  expect(result.current.game).toEqual(toGameDto(game));
  expect(result.current.loading).toBe(false);
});

test("set loading after editing", async () => {
  // Arrange
  const game = Game.create({
    id: Game.createId(),
    owner: User.createId("id"),
    points: ApplicablePoints.create([StoryPoint.create(3)]),
    name: "game",
  })[0];
  const repository = newMemoryGameRepository([game]);
  const store = createStore();
  store.set(selectedGameAtom, game);
  store.set(gamesAtom, [game]);

  const { result, rerender } = renderHook(
    createUseGameDetail({
      gameRepository: repository,
      useLoginUser: sinon.fake.returns({ userId: User.createId("id") }),
      deleteGameUseCase: newDeleteGameUseCase(repository),
    }),
    { wrapper: createWrapper(store) }
  );

  // Act
  result.current.requestEdit();
  rerender();

  // Assert
  expect(result.current.loading).toBe(false);
});

test("should remove deleted game", async () => {
  // Arrange
  const game = Game.create({
    id: Game.createId("game"),
    owner: User.createId("id"),
    points: ApplicablePoints.create([StoryPoint.create(3)]),
    name: "game",
  })[0];
  const repository = newMemoryGameRepository([game]);
  const store = createStore();
  store.set(selectedGameAtom, game);
  store.set(gamesAtom, [game]);

  const { result, rerender } = renderHook(
    createUseGameDetail({
      gameRepository: repository,
      useLoginUser: sinon.fake.returns({ userId: User.createId("id") }),
      deleteGameUseCase: newDeleteGameUseCase(repository),
    }),
    { wrapper: createWrapper(store) }
  );

  // Act
  result.current.delete();
  await waitFor(async () => !result.current.loading);
  rerender();

  // Assert
  expect(result.current.game).toBeUndefined();
  expect(store.get(gamesAtom)).toHaveLength(0);
  expect(store.get(gameStatusAtom)).toBe(GameStatus.NotSelect);
});
