import { test, expect } from "vitest";
import sinon from "sinon";
import * as Game from "@/domains/game";
import * as User from "@/domains/user";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as GamePlayer from "@/domains/game-player";
import * as UserHand from "@/domains/user-hand";

import { createMockedDispatcher, createMockedGameRepository } from "@/test-lib";
import { ShowDownUseCase } from "./show-down";

const CARDS = SelectableCards.create([StoryPoint.create(1)]);

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    gameId: Game.createId(),
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
  const gameId = Game.createId();
  const player = GamePlayer.create({
    id: GamePlayer.createId(),
    gameId,
    userId: User.createId(),
  });
  const game = Game.create({
    id: gameId,
    name: "game",
    players: [player.id],
    cards: CARDS,
    hands: [{ playerId: player.id, hand: UserHand.handed(CARDS[0]) }],
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
  const gameId = Game.createId();
  const player = GamePlayer.create({
    id: GamePlayer.createId(),
    gameId,
    userId: User.createId(),
  });
  const game = Game.create({
    id: gameId,
    name: "game",
    players: [player.id],
    cards: CARDS,
    hands: [{ playerId: player.id, hand: UserHand.handed(CARDS[0]) }],
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
