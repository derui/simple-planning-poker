import { test, expect } from "vitest";
import sinon from "sinon";

import { create, createId } from "@/domains/game";
import { create } from "@/domains/selectable-cards";
import { create } from "@/domains/story-point";
import { createId } from "@/domains/user";
import { createMockedDispatcher, createMockedGameRepository } from "@/test-lib";
import { ShowDownUseCase } from "./show-down";
import { createGamePlayer, createId } from "@/domains/game-player";

const CARDS = create([create(1)]);

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    gameId: createId(),
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
  const gameId = createId();
  const player = createGamePlayer({
    id: createId(),
    gameId,
    userId: createId(),
    cards: CARDS,
  });
  const game = create({
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
  const gameId = createId();
  const player = createGamePlayer({
    id: createId(),
    gameId,
    userId: createId(),
    cards: CARDS,
  });
  const game = create({
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
