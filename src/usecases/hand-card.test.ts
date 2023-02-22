import { test, expect } from "vitest";
import * as sinon from "sinon";
import { createId } from "@/domains/game";
import { create } from "@/domains/selectable-cards";
import { create } from "@/domains/story-point";
import { createId } from "@/domains/user";
import { createMockedDispatcher, createMockedGamePlayerRepository } from "@/test-lib";
import { createGiveUpCard } from "@/domains/card";
import { HandCardUseCase } from "./hand-card";
import { createGamePlayer, createId } from "@/domains/game-player";

const CARDS = create([create(1)]);

test("should return error if player is not found", async () => {
  // Arrange
  const input = {
    playerId: createId(),
    card: createGiveUpCard(),
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
  const player = createGamePlayer({
    id: createId(),
    userId: createId(),
    gameId: createId(),
    cards: CARDS,
  });
  const input = {
    playerId: player.id,
    card: createGiveUpCard(),
  };
  const findBy = sinon.fake.returns(Promise.resolve(player));
  const repository = createMockedGamePlayerRepository({
    findBy,
  });
  const dispatcher = createMockedDispatcher();

  const useCase = new HandCardUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toEqual("success");
  expect(player.hand).toEqual(createGiveUpCard());
});

test("should dispatch UserHanded event", async () => {
  // Arrange
  const player = createGamePlayer({
    id: createId(),
    userId: createId(),
    gameId: createId(),
    cards: CARDS,
  });
  const input = {
    playerId: player.id,
    card: createGiveUpCard(),
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
