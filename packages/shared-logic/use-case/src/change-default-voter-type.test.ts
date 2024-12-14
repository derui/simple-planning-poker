import { User, VoterType } from "@spp/shared-domain";
import { clear, UserRepository } from "@spp/shared-domain/mock/user-repository";
import { beforeEach, expect, test } from "vitest";
import { ChangeDefaultVoterTypeUseCase } from "./change-default-voter-type.js";

beforeEach(() => {
  clear();
});

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    voterType: VoterType.Inspector,
  };

  // Act
  const ret = await ChangeDefaultVoterTypeUseCase(input);

  // Assert
  expect(ret.kind).toBe("notFound");
});

test("should save user", async () => {
  // Arrange
  const user = User.createId();

  const input = {
    userId: user,
    voterType: VoterType.Normal,
  };

  await UserRepository.save({
    user: User.create({
      id: user,
      name: "foo",
      defaultVoterType: VoterType.Inspector,
    }),
  });

  // Act
  const ret = await ChangeDefaultVoterTypeUseCase(input);

  // Assert
  expect(ret.kind).toBe("success");
  const saved = await UserRepository.findBy({ id: input.userId });
  expect(saved?.defaultVoterType).toBe(VoterType.Normal);
});
