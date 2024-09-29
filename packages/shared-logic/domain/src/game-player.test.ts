import { test, expect } from "vitest";
import { changeUserMode, createOwner, createPlayer, PlayerType, UserMode } from "./game-player.js";
import * as User from "./user.js";

test("create user with id", () => {
  // Arrange
  const userId = User.createId();

  // Act
  const ret = createPlayer({
    mode: UserMode.Normal,
    user: userId,
  });

  // Assert
  expect(ret).toEqual({
    type: PlayerType.Player,
    mode: UserMode.Normal,
    user: userId,
  });
});

test("change mode", () => {
  // Arrange
  const player = createPlayer({
    user: User.createId(),
  });

  // Act
  const ret = changeUserMode(player, UserMode.Inspector);

  // Assert
  expect(ret.mode).toEqual(UserMode.Inspector);
});

test("create owner", () => {
  // Arrange
  const userId = User.createId();

  // Act
  const ret = createOwner({
    mode: UserMode.Normal,
    user: userId,
  });

  // Assert
  expect(ret).toEqual({
    type: PlayerType.Owner,
    mode: UserMode.Normal,
    user: userId,
  });
});
