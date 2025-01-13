import { ApplicablePoints, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { clear as clearGame, injectErrorOnSave } from "@spp/shared-domain/mock/game-repository";
import { clear as clearUser } from "@spp/shared-domain/mock/user-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { clearSubsctiptions } from "@spp/shared-use-case";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";
import { beforeEach, expect, test } from "vitest";
import { toGameDto } from "./dto.js";
import { loadGameAtom } from "./game-atom.js";
import { useEditGame } from "./use-edit-game.js";
import { loadUserAtom } from "./user-atom.js";

beforeEach(async () => {
  clearSubsctiptions();
  injectErrorOnSave(undefined);

  clearGame();
  clearUser();

  await UserRepository.save({
    user: User.create({
      id: User.createId("id"),
      name: "name",
    }),
  });
});

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

test("initial status", () => {
  // Arrange
  const store = createStore();
  store.set(loadUserAtom, User.createId("user"));

  // Act
  const { result } = renderHook(useEditGame, {
    wrapper: createWrapper(store),
  });

  // Assert
  expect(result.current.errors).toHaveLength(0);
  expect(result.current.loading).toBe(true);
});

test("set loading after editing", async () => {
  // Arrange
  const game = Game.create({
    id: Game.createId(),
    owner: User.createId("id"),
    points: ApplicablePoints.create([StoryPoint.create(3)]),
    name: GameName.create("game"),
  })[0];
  await GameRepository.save({ game });

  const store = createStore();
  store.set(loadUserAtom, User.createId("id"));
  const { result, rerender } = renderHook(useEditGame, { wrapper: createWrapper(store) });

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
    name: GameName.create("game"),
  })[0];
  await GameRepository.save({ game });
  const store = createStore();
  store.set(loadUserAtom, User.createId("id"));
  store.set(loadGameAtom, game.id);
  const { result } = renderHook(useEditGame, { wrapper: createWrapper(store) });

  // Act
  await waitFor(async () => !result.current.loading);
  await act(async () => result.current.edit("new", "1,2,3"));
  await waitFor(async () => !result.current.loading);

  // Assert
  const actual = await GameRepository.findBy({ id: game.id });
  expect(result.current.errors).toHaveLength(0);
  expect(toGameDto(actual!)).toEqual({ id: "game", name: "new", points: "1,2,3" });
});
