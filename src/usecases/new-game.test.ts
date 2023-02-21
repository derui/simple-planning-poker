import { test, expect } from "vitest";
import { createGame, createGameId } from "@/domains/game";
import { createSelectableCards } from "@/domains/selectable-cards";
import { createStoryPoint } from "@/domains/story-point";
import { createMockedDispatcher, createMockedGameRepository } from "@/test-lib";
import { NewGameUseCase } from "./new-game";
import { createGamePlayerId } from "@/domains/game-player";
import * as sinon from "sinon";

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    gameId: createGameId(),
  };
  const repository = createMockedGameRepository();
  const dispatcher = createMockedDispatcher();

  const useCase = new NewGameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toEqual("notFoundGame");
});

test("should save game showed down", async () => {
  // Arrange
  const game = createGame({
    id: createGameId(),
    name: "name",
    players: [createGamePlayerId()],
    cards: createSelectableCards([createStoryPoint(1)]),
  });

  const input = {
    gameId: game.id,
  };
  const repository = createMockedGameRepository({
    findBy: sinon.fake.resolves(game),
  });
  const dispatcher = createMockedDispatcher();

  const useCase = new NewGameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toEqual("success");
});

test("should dispatch NewGame event", async () => {
  // Arrange
  const game = createGame({
    id: createGameId(),
    name: "name",
    players: [createGamePlayerId()],
    cards: createSelectableCards([createStoryPoint(1)]),
  });

  const input = {
    gameId: game.id,
  };

  const dispatch = sinon.fake();
  const repository = createMockedGameRepository({
    findBy: sinon.fake.resolves(game),
  });
  const dispatcher = createMockedDispatcher({ dispatch });

  const useCase = new NewGameUseCase(dispatcher, repository);

  // Act
  await useCase.execute(input);

  // Assert
  expect(dispatch.lastCall.firstArg.kind).toEqual("NewGameStarted");
});
