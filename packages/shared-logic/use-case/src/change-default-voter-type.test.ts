import { User, VoterType } from "@spp/shared-domain";
import { newMemoryUserRepository } from "@spp/shared-domain/mock/user-repository";
import { expect, test } from "vitest";
import { newChangeDefaultVoterTypeUseCase } from "./change-default-voter-type.js";

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    voterType: VoterType.Inspector,
  };

  const repository = newMemoryUserRepository();
  const useCase = newChangeDefaultVoterTypeUseCase(repository);

  // Act
  const ret = await useCase(input);

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

  const repository = newMemoryUserRepository([
    User.create({
      id: user,
      name: "foo",
      defaultVoterType: VoterType.Inspector,
    }),
  ]);
  const useCase = newChangeDefaultVoterTypeUseCase(repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toBe("success");
  const saved = await repository.findBy(input.userId);
  expect(saved?.defaultVoterType).toBe(VoterType.Normal);
});
