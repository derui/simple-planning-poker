import { ApplicablePoints, Game, StoryPoint, User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { newDeleteGameUseCase, newEditGameUseCase } from "@spp/shared-use-case";
import { renderHook, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";
import sinon from "sinon";
import { expect, test } from "vitest";
import { toGameDto } from "./dto.js";
import { gamesAtom, selectedGameAtom } from "./game-atom.js";
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
        editGameUseCase: newEditGameUseCase(newMemoryGameRepository()),
        deleteGameUseCase: newDeleteGameUseCase(newMemoryGameRepository()),
      })(),
    {
      wrapper: createWrapper(store),
    }
  );

  // Assert
  expect(result.current.game).toBeUndefined();
  expect(result.current.status).toBe("completed");
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
      editGameUseCase: newEditGameUseCase(repository),
      deleteGameUseCase: newDeleteGameUseCase(repository),
    }),
    { wrapper }
  );

  // Assert
  expect(result.current.game).toEqual(toGameDto(game));
  expect(result.current.status).toBe("completed");
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
      editGameUseCase: newEditGameUseCase(repository),
      deleteGameUseCase: newDeleteGameUseCase(repository),
    }),
    { wrapper: createWrapper(store) }
  );

  // Act
  result.current.edit("foo", "1,2,3");
  rerender();

  // Assert
  expect(result.current.status).toBe("editing");
});

test("should updated edited game", async () => {
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
      editGameUseCase: newEditGameUseCase(repository),
      deleteGameUseCase: newDeleteGameUseCase(repository),
    }),
    { wrapper: createWrapper(store) }
  );

  // Act
  result.current.edit("new", "1,2,3");
  await waitFor(async () => result.current.status == "completed");
  rerender();

  // Assert
  expect(result.current.game).toEqual({ id: "game", name: "new", points: "1,2,3" });
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
      editGameUseCase: newEditGameUseCase(repository),
      deleteGameUseCase: newDeleteGameUseCase(repository),
    }),
    { wrapper: createWrapper(store) }
  );

  // Act
  result.current.delete();
  await waitFor(async () => result.current.status == "completed");
  rerender();

  // Assert
  expect(result.current.status).toBe("completed");
  expect(result.current.game).toBeUndefined();
  expect(store.get(gamesAtom)).toHaveLength(0);
});
