import { test, expect } from "vitest";
import { createStoryPointCard } from "./card";
import { DOMAIN_EVENTS } from "./event";
import { createGameId } from "./game";
import { createGamePlayer, createGamePlayerId, UserMode } from "./game-player";
import { createSelectableCards } from "./selectable-cards";
import { createStoryPoint } from "./story-point";
import { createUserId } from "./user";

const cards = createSelectableCards([1, 2, 3, 4].map(createStoryPoint));

test("create user with id", () => {
  // Arrange
  const userId = createUserId();

  // Act
  const ret = createGamePlayer({
    id: createGamePlayerId(),
    gameId: createGameId(),
    mode: UserMode.normal,
    userId: userId,
    cards,
  });

  // Assert
  expect(ret.mode).toEqual(UserMode.normal);
});

test("change mode", () => {
  // Arrange
  const player = createGamePlayer({
    id: createGamePlayerId(),
    gameId: createGameId(),
    userId: createUserId(),
    cards,
  });

  // Act
  player.changeUserMode(UserMode.inspector);

  // Assert
  expect(player.mode).toEqual(UserMode.inspector);
});

test("should return event to notify user name changed", () => {
  // Arrange
  const player = createGamePlayer({
    id: createGamePlayerId(),
    gameId: createGameId(),
    userId: createUserId(),
    cards,
  });

  // Act
  const event = player.changeUserMode(UserMode.inspector);

  // Assert
  expect(event.kind).toEqual(DOMAIN_EVENTS.GamePlayerModeChanged);
  expect(event.mode).toEqual(UserMode.inspector);
  expect(event.gamePlayerId).toBe(player.id);
});

test("should be able to take hand from selectable cards", () => {
  // Arrange
  const player = createGamePlayer({
    id: createGamePlayerId(),
    gameId: createGameId(),
    userId: createUserId(),
    cards,
  });

  // Act
  player.takeHand(cards.cards[0]);

  // Assert
  expect(player.hand).toBe(cards.cards[0]);
});

test("should be undefined that hand is if player not take hand", () => {
  // Arrange
  const player = createGamePlayer({
    id: createGamePlayerId(),
    gameId: createGameId(),
    userId: createUserId(),
    cards,
  });

  // Act

  // Assert
  expect(player.hand).toBeUndefined;
});

test("should not take card that cards do not contain", () => {
  // Arrange
  const player = createGamePlayer({
    id: createGamePlayerId(),
    gameId: createGameId(),
    userId: createUserId(),
    cards,
  });

  // Act
  const ret = player.takeHand(createStoryPointCard(createStoryPoint(5)));

  // Assert
  expect(player.hand).toBeUndefined;
  expect(ret).toBeUndefined;
});
