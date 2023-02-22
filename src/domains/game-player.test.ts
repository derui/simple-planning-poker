import { test, expect } from "vitest";
import * as Card from "./card";
import { DOMAIN_EVENTS, GamePlayerModeChanged } from "./event";
import * as Game from "./game";
import { changeUserMode, createGamePlayer, createId, takeHand, UserMode } from "./game-player";
import * as StoryPoint from "./story-point";
import * as User from "./user";
import * as UserHand from "./user-hand";
import * as SelectableCards from "./selectable-cards";

const cards = SelectableCards.create([1, 2, 3, 4].map(StoryPoint.create));

test("create user with id", () => {
  // Arrange
  const userId = User.createId();

  // Act
  const ret = createGamePlayer({
    id: createId(),
    gameId: Game.createId(),
    mode: UserMode.normal,
    userId: userId,
  });

  // Assert
  expect(ret.mode).toEqual(UserMode.normal);
});

test("change mode", () => {
  // Arrange
  const player = createGamePlayer({
    id: createId(),
    gameId: Game.createId(),
    userId: User.createId(),
  });

  // Act
  const [ret] = changeUserMode(player, UserMode.inspector);

  // Assert
  expect(ret.mode).toEqual(UserMode.inspector);
});

test("should return event to notify user name changed", () => {
  // Arrange
  const player = createGamePlayer({
    id: createId(),
    gameId: Game.createId(),
    userId: User.createId(),
  });

  // Act
  const [, event] = changeUserMode(player, UserMode.inspector);

  // Assert
  expect(event.kind).toEqual(DOMAIN_EVENTS.GamePlayerModeChanged);
  expect((event as GamePlayerModeChanged).mode).toEqual(UserMode.inspector);
  expect((event as GamePlayerModeChanged).gamePlayerId).toBe(player.id);
});

test("should be able to take hand from selectable cards", () => {
  // Arrange
  const player = createGamePlayer({
    id: createId(),
    gameId: Game.createId(),
    userId: User.createId(),
  });

  // Act
  const [ret] = takeHand(player, cards[0], cards);

  // Assert
  expect(ret.hand).toEqual(UserHand.handed(cards[0]));
});

test("throw error if the card is not contains cards", () => {
  // Arrange
  const player = createGamePlayer({
    id: createId(),
    gameId: createId(),
    userId: User.createId(),
  });

  // Act

  // Assert

  expect(() => takeHand(player, Card.create(StoryPoint.create(10)), cards)).toThrowError();
});

test("should be unselected that hand is if player not take hand", () => {
  // Arrange
  const player = createGamePlayer({
    id: createId(),
    gameId: Game.createId(),
    userId: User.createId(),
  });

  // Act

  // Assert
  expect(player.hand).toEqual(UserHand.unselected());
});
