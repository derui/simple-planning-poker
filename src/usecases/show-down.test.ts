import { test, expect } from "vitest";
import sinon from "sinon";

import { createGame, createGameId } from "@/domains/game";
import { createSelectableCards } from "@/domains/selectable-cards";
import { createStoryPoint } from "@/domains/story-point";
import { createUserId } from "@/domains/user";
import { createMockedDispatcher, createMockedGameRepository } from "@/test-lib";
import { ShowDownUseCase } from "./show-down";
import { createGamePlayer, createGamePlayerId } from "@/domains/game-player";

const CARDS = createSelectableCards([createStoryPoint(1)]);

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    gameId: createGameId(),
  };
  const repository = createMockedGameRepository();
  const dispatcher = createMockedDispatcher();

  const useCase = new ShowDownUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toEqual("notFoundGame");
});

test("should save game showed down", async () => {
  // Arrange
  const gameId = createGameId();
  const player = createGamePlayer({
    id: createGamePlayerId(),
    gameId,
    userId: createUserId(),
    cards: CARDS,
  });
  const game = createGame({
    id: gameId,
    name: "game",
    players: [player.id],
    cards: CARDS,
    hands: [{ playerId: player.id, card: CARDS.at(0) }],
  });

  const input = {
    gameId: game.id,
  };
  const repository = createMockedGameRepository({
    findBy: sinon.fake.resolves(game),
  });
  const dispatcher = createMockedDispatcher();

  const useCase = new ShowDownUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toEqual("success");
  expect(game.showedDown).toBeTruthy;
});

test("should dispatch ShowedDown event", async () => {
  // Arrange
  const gameId = createGameId();
  const player = createGamePlayer({
    id: createGamePlayerId(),
    gameId,
    userId: createUserId(),
    cards: CARDS,
  });
  const game = createGame({
    id: gameId,
    name: "game",
    players: [player.id],
    cards: CARDS,
    hands: [{ playerId: player.id, card: CARDS.at(0) }],
  });

  const input = {
    gameId: game.id,
  };
  const dispatch = sinon.fake();
  const repository = createMockedGameRepository({
    findBy: sinon.fake.resolves(game),
  });
  const dispatcher = createMockedDispatcher({ dispatch });

  const useCase = new ShowDownUseCase(dispatcher, repository);

  // Act
  await useCase.execute(input);

  // Assert
  expect(dispatch.lastCall.firstArg.gameId).toEqual(game.id);
});
