import { test, expect } from "vitest";
import { create, createId, showDown, calculateAverage } from "./game";
import * as GamePlayer from "./game-player";
import * as SelectableCards from "./selectable-cards";
import * as StoryPoint from "./story-point";
import * as UserHand from "./user-hand";

const cards = SelectableCards.create([1, 2].map(StoryPoint.create));

test("throw error if initial joined user is empty", () => {
  // Arrange

  // Act
  // Assert
  expect(() => create({ id: createId(), name: "name", players: [], cards })).toThrowError(/Least one player need/);
});

test("should not be able to show down when all user did not hand yet", () => {
  // Arrange
  const game = create({
    id: createId(),
    name: "name",
    players: [GamePlayer.createId()],
    cards,
  });

  // Act
  const [, event] = showDown(game);

  // Assert
  expect(event).toBeUndefined;
});

test("should be able to show down when least one user handed", () => {
  // Arrange
  const user1 = GamePlayer.createId();
  const user2 = GamePlayer.createId();
  const game = create({
    id: createId(),
    name: "name",
    players: [user1, user2],
    cards,
    hands: [{ playerId: user1, hand: UserHand.handed(cards[0]) }],
  });

  // Act
  const [ret, event] = showDown(game);

  // Assert
  expect(ret.showedDown).toBeTruthy;
  expect(calculateAverage(ret)).toEqual(1);
  expect(event).not.toBeUndefined;
});

test("should return undefined as average when the game does not show down yet", () => {
  // Arrange
  const user1 = GamePlayer.createId();
  const game = create({
    id: createId(),
    name: "name",
    players: [user1],
    cards,
  });

  // Act
  const ret = calculateAverage(game);

  // Assert
  expect(game.showedDown).toBeFalsy();
  expect(ret).toBeUndefined;
});

test("should return average story point when the game showed down", () => {
  // Arrange
  const user1 = GamePlayer.createId();
  const user2 = GamePlayer.createId();
  let game = create({
    id: createId(),
    name: "name",
    players: [user1, user2],
    cards,
    hands: [
      { playerId: user1, hand: UserHand.handed(cards[0]) },
      { playerId: user2, hand: UserHand.handed(cards[1]) },
    ],
  });

  // Act
  [game] = showDown(game);
  const ret = calculateAverage(game);

  // Assert
  expect(ret).toEqual(1.5);
});

test("should ignore give up card to calculate average", () => {
  // Arrange
  const user1 = GamePlayer.createId();
  const user2 = GamePlayer.createId();
  const user3 = GamePlayer.createId();

  let game = create({
    id: createId(),
    name: "name",
    players: [user1, user2, user3],
    cards,
    hands: [
      { playerId: user1, hand: UserHand.handed(cards[0]) },
      { playerId: user2, hand: UserHand.giveUp() },
      { playerId: user3, hand: UserHand.unselected() },
    ],
  });

  // Act
  [game] = showDown(game);
  const ret = calculateAverage(game);

  // Assert
  expect(ret).toEqual(1);
});

test("should return 0 if all user giveup", () => {
  // Arrange
  const user1 = GamePlayer.createId();
  const user2 = GamePlayer.createId();

  let game = create({
    id: createId(),
    name: "name",
    players: [user1, user2],
    cards,
    hands: [
      { playerId: user1, hand: UserHand.giveUp() },
      { playerId: user2, hand: UserHand.giveUp() },
    ],
  });

  // Act
  [game] = showDown(game);
  const ret = calculateAverage(game);

  // Assert
  expect(ret).toEqual(0);
});
