import { ApplicablePoints, Game, StoryPoint, User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { newEditGameUseCase } from "@spp/shared-use-case";
import { renderHook, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";
import sinon from "sinon";
import { expect, test } from "vitest";
import { toGameDto } from "./dto.js";
import { gamesAtom, selectedGameAtom } from "./game-atom.js";
import { createUseGameEditor } from "./game-editor.js";

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

test("initial status", () => {
  // Arrange
  const store = createStore();

  // Act
  const { result } = renderHook(
    () =>
      createUseGameEditor({
        gameRepository: newMemoryGameRepository(),
        useLoginUser: sinon.fake.returns({ userId: undefined }),
        editGameUseCase: newEditGameUseCase(newMemoryGameRepository()),
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
    createUseGameEditor({
      gameRepository: repository,
      useLoginUser: sinon.fake.returns({ userId: User.createId("id") }),
      editGameUseCase: newEditGameUseCase(repository),
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
    createUseGameEditor({
      gameRepository: repository,
      useLoginUser: sinon.fake.returns({ userId: User.createId("id") }),
      editGameUseCase: newEditGameUseCase(repository),
    }),
    { wrapper: createWrapper(store) }
  );

  // Act
  result.current.edit("foo", "1,2,3");
  rerender();

  // Assert
  expect(result.current.loading).toBe(true);
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
    createUseGameEditor({
      gameRepository: repository,
      useLoginUser: sinon.fake.returns({ userId: User.createId("id") }),
      editGameUseCase: newEditGameUseCase(repository),
    }),
    { wrapper: createWrapper(store) }
  );

  // Act
  result.current.edit("new", "1,2,3");
  await waitFor(async () => !result.current.loading);
  rerender();

  // Assert
  expect(result.current.game).toEqual({ id: "game", name: "new", points: "1,2,3" });
});
