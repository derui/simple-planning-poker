import { useLoginUser } from "@spp/feature-login";
import { ApplicablePoints, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { clear, injectErrorOnSave } from "@spp/shared-domain/mock/game-repository";
import { clearSubsctiptions } from "@spp/shared-use-case";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { toGameDto } from "./dto.js";
import { useEditGame } from "./use-edit-game.js";

vi.mock(import("@spp/feature-login"), async (importOriginal) => {
  const mod = await importOriginal();

  return {
    ...mod,
    useLoginUser: vi.fn(),
  };
});

beforeEach(() => {
  clear();
  clearSubsctiptions();
  injectErrorOnSave(undefined);

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
  const { result } = renderHook(useEditGame, {
    wrapper: createWrapper(store),
  });

  // Assert
  expect(result.current.errors).toHaveLength(0);
  expect(result.current.loading).toBe(false);
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
  const { result, rerender } = renderHook(useEditGame, { wrapper: createWrapper(createStore()) });

  // Act
  result.current.edit(game.id, "foo", "1,2,3");
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
  const { result } = renderHook(useEditGame, { wrapper: createWrapper(createStore()) });

  // Act
  await act(async () => result.current.edit(game.id, "new", "1,2,3"));
  await waitFor(async () => !result.current.loading);

  // Assert
  const actual = await GameRepository.findBy({ id: game.id });
  expect(result.current.errors).toHaveLength(0);
  expect(toGameDto(actual!)).toEqual({ id: "game", name: "new", points: "1,2,3" });
});

describe("validation", () => {
  test("get error if the game not found", async () => {
    // Arrange
    const { result } = renderHook(useEditGame, { wrapper: createWrapper(createStore()) });

    // Act
    await act(async () => result.current.edit(Game.createId(), "new", "1,2,3"));
    await waitFor(async () => !result.current.loading);

    // Assert
    expect(result.current.errors).toContainEqual("NotFound");
  });
});
