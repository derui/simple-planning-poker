import { test, expect } from "vitest";
import { changeUserMode, create, UserMode } from "./game-player";
import * as User from "./user";

test("create user with id", () => {
  // Arrange
  const userId = User.createId();

  // Act
  const ret = create({
    mode: UserMode.normal,
    userId: userId,
  });

  // Assert
  expect(ret.mode).toEqual(UserMode.normal);
});

test("change mode", () => {
  // Arrange
  const player = create({
    userId: User.createId(),
  });

  // Act
  const ret = changeUserMode(player, UserMode.inspector);

  // Assert
  expect(ret.mode).toEqual(UserMode.inspector);
});
