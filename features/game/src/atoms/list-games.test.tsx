import { ApplicablePoints, Game, StoryPoint, User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { newMemoryVotingRepository } from "@spp/shared-domain/mock/voting-repository";
import { newStartVotingUseCase } from "@spp/shared-use-case";
import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import sinon from "sinon";
import { expect, test } from "vitest";
import { createUseListGames } from "./list-games.js";
import { VoteStartingStatus } from "./type.js";

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
        startVotingUseCase: sinon.fake(),
        useLoginUser: sinon.fake.returns({ userId: undefined }),
      })(),
    {
      wrapper: createWrapper(store),
    }
  );

  // Assert
  expect(result.current.games).toHaveLength(0);
  expect(result.current.voteStartingStatus).toBeUndefined();
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
      startVotingUseCase: sinon.fake(),
    }),
    { wrapper }
  );

  // Wait a promise
  await act(async () => {});
  rerender();

  // Assert
  expect(result.current.games).toHaveLength(1);
});

test("Cast your vote", async () => {
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
      startVotingUseCase: sinon.fake.rejects({ kind: "failed" }),
    }),
    { wrapper }
  );
  await act(async () => {});

  // Act
  result.current.startVoting("game");
  rerender();

  // Assert
  expect(result.current.voteStartingStatus).toEqual(VoteStartingStatus.Starting);
});

test("started voting after success", async () => {
  // Arrange
  const gameId = Game.createId("game");
  const game = Game.create({
    id: gameId,
    owner: User.createId("id"),
    points: ApplicablePoints.create([StoryPoint.create(3)]),
    name: "game",
  })[0];
  const repository = newMemoryGameRepository([game]);
  const store = createStore();
  const wrapper = createWrapper(store);
  const { result, rerender } = renderHook(
    createUseListGames({
      gameRepository: repository,
      useLoginUser: sinon.fake.returns({ userId: User.createId("id") }),
      startVotingUseCase: newStartVotingUseCase(repository, newMemoryVotingRepository(), sinon.fake()),
    }),
    { wrapper }
  );
  await act(async () => {});

  // Act
  result.current.startVoting("game");

  await act(async () => {});
  rerender();

  // Assert
  expect(result.current.voteStartingStatus).toEqual(VoteStartingStatus.Started);
});

test("Reset status to undefined after failure.", async () => {
  // Arrange
  const gameId = Game.createId("game");
  const game = Game.create({
    id: gameId,
    owner: User.createId("id"),
    points: ApplicablePoints.create([StoryPoint.create(3)]),
    name: "game",
  })[0];
  const repository = newMemoryGameRepository([game]);
  const store = createStore();
  const wrapper = createWrapper(store);
  const { result, rerender } = renderHook(
    createUseListGames({
      gameRepository: repository,
      useLoginUser: sinon.fake.returns({ userId: User.createId("id") }),
      startVotingUseCase: sinon.fake.rejects({ kind: "failed" }),
    }),
    { wrapper }
  );
  await act(async () => {});

  // Act
  result.current.startVoting("game");

  await act(async () => {});
  rerender();

  // Assert
  expect(result.current.voteStartingStatus).toBeUndefined();
});
