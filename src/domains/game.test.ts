import { test, expect } from "vitest";
import { createGame, createGameId } from "./game";
import { createGamePlayerId } from "./game-player";
import { createSelectableCards } from "./selectable-cards";
import { createStoryPoint } from "./story-point";

const cards = createSelectableCards([1, 2].map(createStoryPoint));

test("throw error if initial joined user is empty", () => {
  // Arrange

  // Act
  // Assert
  expect(() => createGame({ id: createGameId(), name: "name", players: [], cards })).toThrowError(
    /Least one player need/
  );
});

test("should not be able to show down when all user did not hand yet", () => {
  // Arrange
  const game = createGame({
    id: createGameId(),
    name: "name",
    players: [createGamePlayerId()],
    cards,
  });

  // Act
  const ret = game.showDown();

  // Assert
  expect(ret).toBeUndefined;
});

test("should be able to show down when least one user handed", () => {
  // Arrange
  const user1 = createGamePlayerId();
  const user2 = createGamePlayerId();
  const game = createGame({
    id: createGameId(),
    name: "name",
    players: [user1, user2],
    cards,
    hands: [{ playerId: user1, card: cards.at(0) }],
  });

  // Act
  const ret = game.showDown();

  // Assert
  expect(game.showedDown).toBeTruthy;
  expect(game.calculateAverage()).toEqual(createStoryPoint(1));
  expect(ret).not.toBeUndefined;
});

test("should return undefined as average when the game does not show down yet", () => {
  // Arrange
  const user1 = createGamePlayerId();
  const game = createGame({
    id: createGameId(),
    name: "name",
    players: [user1],
    cards,
  });

  // Act
  const ret = game.calculateAverage();

  // Assert
  expect(game.showedDown).toBeFalsy();
  expect(ret).toBeUndefined;
});

test("should return average story point when the game showed down", () => {
  // Arrange
  const user1 = createGamePlayerId();
  const user2 = createGamePlayerId();
  const game = createGame({
    id: createGameId(),
    name: "name",
    players: [user1, user2],
    cards,
    hands: [
      { playerId: user1, card: cards.at(0) },
      { playerId: user2, card: cards.at(1) },
    ],
  });

  // Act
  game.showDown();
  const ret = game.calculateAverage();

  // Assert
  expect(ret).toEqual(createStoryPoint(1.5));
});

test("should ignore give up card to calculate average", () => {
  // Arrange
  const user1 = createGamePlayerId();
  const user2 = createGamePlayerId();

  const game = createGame({
    id: createGameId(),
    name: "name",
    players: [user1, user2],
    cards,
    hands: [
      { playerId: user1, card: cards.at(0) },
      { playerId: user2, card: cards.giveUp },
    ],
  });

  // Act
  game.showDown();
  const ret = game.calculateAverage();

  // Assert
  expect(ret).toEqual(createStoryPoint(1));
});

test("should return 0 if all user giveup", () => {
  // Arrange
  const user1 = createGamePlayerId();
  const user2 = createGamePlayerId();

  const game = createGame({
    id: createGameId(),
    name: "name",
    players: [user1, user2],
    cards,
    hands: [
      { playerId: user1, card: cards.giveUp },
      { playerId: user2, card: cards.giveUp },
    ],
  });

  // Act
  game.showDown();
  const ret = game.calculateAverage();

  // Assert
  expect(ret).toEqual(createStoryPoint(0));
});
