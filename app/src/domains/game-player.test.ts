import { test, expect } from "vitest";
import { changeUserMode, create, PlayerType, UserMode } from "./game-player";
import * as User from "./user";

test("create user with id", () => {
  // Arrange
  const userId = User.createId();

  // Act
  const ret = create({
    type: PlayerType.owner,
    mode: UserMode.normal,
    user: userId,
  });

  // Assert
  expect(ret).toEqual({
    type: PlayerType.owner,
    mode: UserMode.normal,
    user: userId,
  });
});

test("change mode", () => {
  // Arrange
  const player = create({
    type: PlayerType.player,
    user: User.createId(),
  });

  // Act
  const ret = changeUserMode(player, UserMode.inspector);

  // Assert
  expect(ret.mode).toEqual(UserMode.inspector);
});
