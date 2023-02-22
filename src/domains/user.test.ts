import { test, expect } from "vitest";
import { DOMAIN_EVENTS } from "./event";
import { createId } from "./game";
import * as GamePlayer from "./game-player";
import { createUser, createId, changeName, canChangeName, isJoined, leaveFrom } from "./user";

test("create user with id", () => {
  // Arrange
  const name = "name";

  // Act
  const ret = createUser({
    id: createId(),
    name,
    joinedGames: [],
  });

  // Assert
  expect(ret.name).toEqual("name");
});

test("join user into a game", () => {
  // Arrange
  const name = "name";

  // Act
  const ret = createUser({
    id: createId(),
    name,
    joinedGames: [],
  });

  // Assert
  expect(ret.name).toEqual("name");
});

test("change name", () => {
  // Arrange
  const name = "name";
  const user = createUser({
    id: createId(),
    name,
    joinedGames: [],
  });

  // Act
  const [ret] = changeName(user, "changed name");

  // Assert
  expect(ret.name).toEqual("changed name");
});

test("throw error if user name is empty", () => {
  // Arrange

  // Act

  // Assert
  expect(() =>
    createUser({
      id: createId(),
      name: "",
      joinedGames: [],
    })
  ).toThrowError();
});

test("throw error when change to empty name", () => {
  // Arrange
  const name = "name";
  const user = createUser({
    id: createId(),
    name,
    joinedGames: [],
  });

  // Act

  // Assert
  expect(() => changeName(user, "")).toThrowError();
});

test("validate name", () => {
  // Arrange

  // Act

  // Assert
  expect(canChangeName("")).toBeFalsy;
  expect(canChangeName("foo")).toBeTruthy;
});

test("should return event to notify user name changed", () => {
  // Arrange
  const name = "name";
  const user = createUser({
    id: createId(),
    name,
    joinedGames: [],
  });

  // Act
  const [, event] = changeName(user, "foobar");

  // Assert
  expect(event.kind).toEqual(DOMAIN_EVENTS.UserNameChanged);
  expect(event.name).toEqual("foobar");
  expect(event.userId).toBe(user.id);
});

test("should be able to get joined games", () => {
  // Arrange
  const gameId = createId();
  const name = "name";
  const playerId = GamePlayer.createId();

  // Act
  const user = createUser({
    id: createId(),
    name,
    joinedGames: [
      { gameId, playerId },
      { gameId, playerId },
    ],
  });

  // Assert
  expect(user.joinedGames).toEqual([{ gameId, playerId }]);
});

test("should be able to check a user is joined to a game", () => {
  // Arrange
  const gameId = createId();
  const name = "name";
  const playerId = GamePlayer.createId();

  // Act
  const user = createUser({
    id: createId(),
    name,
    joinedGames: [{ gameId, playerId }],
  });

  // Assert
  expect(isJoined(user, gameId)).toBeTruthy();
});

test("should be able to leave from the game user already joined", () => {
  // Arrange
  const gameId = createId();
  const name = "name";
  const playerId = GamePlayer.createId();

  const user = createUser({
    id: createId(),
    name,
    joinedGames: [{ gameId, playerId }],
  });

  // Act
  const [, ret] = leaveFrom(user, gameId);

  // Assert
  expect(ret).not.toBeUndefined();
  expect(ret?.kind).toEqual(DOMAIN_EVENTS.UserLeavedFromGame);
});

test("should not be able to leave from the game user did not join", () => {
  // Arrange
  const gameId = createId();
  const name = "name";

  const user = createUser({
    id: createId(),
    name,
    joinedGames: [],
  });

  // Act
  const [, ret] = leaveFrom(user, gameId);

  // Assert
  expect(ret).toBeUndefined();
});
