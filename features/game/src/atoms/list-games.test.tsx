import { ApplicablePoints, Game, StoryPoint, User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { newMemoryUserRepository } from "@spp/shared-domain/mock/user-repository";
import { newMemoryVotingRepository } from "@spp/shared-domain/mock/voting-repository";
import { newStartVotingUseCase } from "@spp/shared-use-case";
import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";
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
        userRepository: newMemoryUserRepository(),
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
      userRepository: newMemoryUserRepository(),
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
      userRepository: newMemoryUserRepository(),
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
      userRepository: newMemoryUserRepository(),
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

test("get next voting id by callback after started", async () => {
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
      userRepository: newMemoryUserRepository(),
    }),
    { wrapper }
  );
  await act(async () => {});

  // Act
  const callback = sinon.fake();
  result.current.startVoting("game", callback);

  await act(async () => {});
  rerender();

  // Assert
  expect(callback.called).toBeTruthy();
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
      userRepository: newMemoryUserRepository(),
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
      startVotingUseCase: sinon.fake(),
      userRepository: newMemoryUserRepository(),
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

test("get login user after effect", async () => {
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
      userRepository: newMemoryUserRepository([
        User.create({
          id: User.createId("id"),
          name: "user",
        }),
      ]),
    }),
    { wrapper }
  );
  await act(async () => {});

  // Act
  rerender();

  // Assert
  expect(result.current.loginUser).toEqual({ id: "id", name: "user" });
});
