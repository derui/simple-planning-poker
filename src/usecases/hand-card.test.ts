import { test, expect } from "vitest";
import * as sinon from "sinon";
import * as Game from "@/domains/game";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";
import { createMemoryGamePlayerRepository, createMockedDispatcher, createMockedGamePlayerRepository } from "@/test-lib";
import * as Card from "@/domains/card";
import { HandCardUseCase } from "./hand-card";
import * as GamePlayer from "@/domains/game-player";
import * as UserHand from "@/domains/user-hand";

const CARDS = SelectableCards.create([StoryPoint.create(1)]);

test("should return error if player is not found", async () => {
  // Arrange
  const input = {
    playerId: GamePlayer.createId(),
    card: Card.create(StoryPoint.create(1)),
    selectableCards: CARDS,
  };
  const repository = createMockedGamePlayerRepository();
  const dispatcher = createMockedDispatcher();

  const useCase = new HandCardUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toEqual("notFoundGamePlayer");
});

test("should save player with card selected by user", async () => {
  // Arrange
  const player = GamePlayer.create({
    id: GamePlayer.createId(),
    userId: User.createId(),
    gameId: Game.createId(),
  });
  const input = {
    playerId: player.id,
    card: Card.create(StoryPoint.create(1)),
    selectableCards: CARDS,
  };
  const repository = createMemoryGamePlayerRepository([player]);
  const dispatcher = createMockedDispatcher();

  const useCase = new HandCardUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toEqual("success");

  const updated = await repository.findBy(player.id);
  expect(updated?.hand).toEqual(UserHand.handed(Card.create(StoryPoint.create(1))));
});

test("should dispatch UserHanded event", async () => {
  // Arrange
  const player = GamePlayer.create({
    id: GamePlayer.createId(),
    userId: User.createId(),
    gameId: Game.createId(),
  });
  const input = {
    playerId: player.id,
    card: Card.create(StoryPoint.create(1)),
    selectableCards: CARDS,
  };
  const findBy = sinon.fake.returns(Promise.resolve(player));
  const repository = createMockedGamePlayerRepository({
    findBy,
  });
  const dispatch = sinon.fake();
  const dispatcher = createMockedDispatcher({ dispatch });

  const useCase = new HandCardUseCase(dispatcher, repository);

  // Act
  await useCase.execute(input);

  // Assert
  expect(dispatch.lastCall.firstArg.card).toEqual(input.card);
  expect(dispatch.lastCall.firstArg.gamePlayerId).toEqual(player.id);
});
