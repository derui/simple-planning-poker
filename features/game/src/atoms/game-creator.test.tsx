import { ApplicablePoints, Game, StoryPoint, User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { newCreateGameUseCase } from "@spp/shared-use-case";
import { renderHook, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";
import sinon from "sinon";
import { expect, test } from "vitest";
import { toGameDto } from "./dto.js";
import { gamesAtom, selectedGameAtom } from "./game-atom.js";
import { createUseGameCreator } from "./game-creator.js";

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

test("initial status", () => {
  // Arrange
  const store = createStore();

  // Act
  const { result } = renderHook(
    () =>
      createUseGameCreator({
        gameRepository: newMemoryGameRepository(),
        useLoginUser: sinon.fake.returns({ userId: undefined }),
        createGameUseCase: newCreateGameUseCase(sinon.fake(), newMemoryGameRepository()),
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
    createUseGameCreator({
      gameRepository: repository,
      useLoginUser: sinon.fake.returns({ userId: User.createId("id") }),
      createGameUseCase: newCreateGameUseCase(sinon.fake(), repository),
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
    createUseGameCreator({
      gameRepository: repository,
      useLoginUser: sinon.fake.returns({ userId: User.createId("id") }),
      createGameUseCase: newCreateGameUseCase(sinon.fake(), repository),
    }),
    { wrapper: createWrapper(store) }
  );

  // Act
  result.current.create("foo", "1,2,3");
  rerender();

  // Assert
  expect(result.current.loading).toBe(true);
});

test("should select game created", async () => {
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
    createUseGameCreator({
      gameRepository: repository,
      useLoginUser: sinon.fake.returns({ userId: User.createId("id") }),
      createGameUseCase: newCreateGameUseCase(sinon.fake(), repository),
    }),
    { wrapper: createWrapper(store) }
  );

  // Act
  result.current.create("new", "1,2,3");
  await waitFor(async () => !result.current.loading);
  rerender();

  // Assert
  expect(result.current.game?.name).toEqual("new");
  expect(result.current.game?.points).toEqual("1,2,3");
});
