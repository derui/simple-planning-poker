import { test, expect } from "vitest";
import { GamePlayerCardSelected } from "@/domains/event";
import { createGameId } from "@/domains/game";
import { createSelectableCards } from "@/domains/selectable-cards";
import { createStoryPoint } from "@/domains/story-point";
import { createUserId } from "@/domains/user";
import { createMockedDispatcher, createMockedGamePlayerRepository } from "@/lib.test";
import { createGiveUpCard } from "@/domains/card";
import { HandCardUseCase } from "./hand-card";
import { createGamePlayer, createGamePlayerId } from "@/domains/game-player";

const CARDS = createSelectableCards([createStoryPoint(1)]);

test("should return error if player is not found", async () => {
  // Arrange
  const input = {
    playerId: createGamePlayerId(),
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
    id: createGamePlayerId(),
    userId: createUserId(),
    gameId: createGameId(),
    cards: CARDS,
  });
  const input = {
    playerId: player.id,
    card: createGiveUpCard(),
  };
  const repository = createMockedGamePlayerRepository();
  const dispatcher = createMockedDispatcher();
  repository.findBy.mockImplementation(() => player);

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
    id: createGamePlayerId(),
    userId: createUserId(),
    gameId: createGameId(),
    cards: CARDS,
  });
  const input = {
    playerId: player.id,
    card: createGiveUpCard(),
  };
  const repository = createMockedGamePlayerRepository();
  const dispatcher = createMockedDispatcher();
  repository.findBy.mockImplementation(() => player);

  const useCase = new HandCardUseCase(dispatcher, repository);

  // Act
  await useCase.execute(input);

  // Assert
  const called = dispatcher.dispatch.mock.calls[0][0] as GamePlayerCardSelected;

  expect(called.card).toEqual(input.card);
  expect(called.gamePlayerId).toEqual(player.id);
});
