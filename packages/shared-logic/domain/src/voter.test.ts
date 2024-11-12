import { expect, test } from "vitest";
import * as User from "./user.js";
import { VoterType } from "./voter-type.js";
import { changeVoterType, createVoter } from "./voter.js";

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
