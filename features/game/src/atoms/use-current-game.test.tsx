import { useLoginUser } from "@spp/feature-login";
import { ApplicablePoints, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { clear } from "@spp/shared-domain/mock/game-repository";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { beforeEach, expect, test, vi } from "vitest";
import { toGameDto } from "./dto.js";
import { useCurrentGame } from "./use-current-game.js";

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

test("initial status", async () => {
  // Arrange
  const store = createStore();

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
  const wrapper = createWrapper(store);

  // Act
  const { result } = renderHook(useCurrentGame, { wrapper });

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
