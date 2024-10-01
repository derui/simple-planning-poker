import { test, expect } from "vitest";
import { changeVoterType, createVoter, VoterType } from "./voter.js";
import * as User from "./user.js";

test("create user with id", () => {
  // Arrange
  const userId = User.createId();

  // Act
  const ret = createVoter({
    type: VoterType.Normal,
    user: userId,
  });

  // Assert
  expect(ret).toEqual({
    type: VoterType.Normal,
    user: userId,
  });
});

test("change mode", () => {
  // Arrange
  const voter = createVoter({
    user: User.createId(),
  });

  // Act
  const ret = changeVoterType(voter, VoterType.Inspector);

  // Assert
  expect(ret.type).toEqual(VoterType.Inspector);
});
