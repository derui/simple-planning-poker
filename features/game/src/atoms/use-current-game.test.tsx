import { ApplicablePoints, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { clear as clearGame } from "@spp/shared-domain/mock/game-repository";
import { clear as clearUser } from "@spp/shared-domain/mock/user-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import sinon from "sinon";
import { beforeEach, expect, test } from "vitest";
import { toGameDto } from "./dto.js";
import { useCurrentGame } from "./use-current-game.js";
import { loadUserAtom } from "./user-atom.js";

beforeEach(async () => {
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

test("initial status", async () => {
  // Arrange
  const store = createStore();
  store.set(loadUserAtom, User.createId("id"));

  // Act
  const { result } = renderHook(useCurrentGame, {
    wrapper: createWrapper(store),
  });

  await waitFor(() => !result.current.loading);

  // Assert
  expect(result.current.game).toBeUndefined();
  expect(result.current.loading).toBe(false);
});

test("get game after select", async () => {
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

  // Act
  const { result } = renderHook(useCurrentGame, { wrapper: createWrapper(store) });

  await act(async () => {
    result.current.select(game.id);
  });

  // Assert
  expect(result.current.game).toEqual(toGameDto(game));
  expect(result.current.loading).toBe(false);
});

test("should loading while deleting a game", async () => {
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

  const { result, rerender } = renderHook(useCurrentGame, { wrapper: createWrapper(store) });

  // Act
  await act(async () => {
    result.current.select(game.id);
  });
  result.current.delete();
  rerender();

  // Assert
  expect(result.current.game).not.toBeUndefined();
  expect(result.current.loading).toBe(true);
});

test("should be able to delete game", async () => {
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

  const { result } = renderHook(useCurrentGame, { wrapper: createWrapper(store) });

  // Act
  await act(async () => {
    result.current.select(game.id);
  });

  await act(async () => result.current.delete());
  await waitFor(async () => !result.current.loading);

  // Assert
  expect(result.current.game).toBeUndefined();
  expect(result.current.loading).toBe(false);
});

test("can not delete a game that have by other user", async () => {
  // Arrange
  const game = Game.create({
    id: Game.createId("game"),
    owner: User.createId("other"),
    points: ApplicablePoints.create([StoryPoint.create(3)]),
    name: GameName.create("game"),
  })[0];
  await GameRepository.save({ game });
  const store = createStore();
  store.set(loadUserAtom, User.createId("id"));

  const { result } = renderHook(useCurrentGame, { wrapper: createWrapper(store) });

  // Act
  await act(async () => {
    result.current.select(game.id);
  });
  const expected = result.current.game;
  await act(async () => result.current.delete());
  await waitFor(async () => !result.current.loading);

  // Assert
  expect(result.current.game).toBe(expected);
  expect(result.current.loading).toBe(false);
});

test("should not start voting if game is not loaded", async () => {
  // Arrange
  const store = createStore();
  store.set(loadUserAtom, User.createId("id"));
  const callback = sinon.fake();

  // Act
  const { result } = renderHook(useCurrentGame, {
    wrapper: createWrapper(store),
  });

  await act(async () => {
    result.current.startVoting(callback);
  });

  // Assert
  expect(callback.called).toBe(false);
});
