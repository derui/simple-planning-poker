import { ApplicablePoints, Game, GameName, GameRepository, StoryPoint, User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import * as sinon from "sinon";
import { expect, test } from "vitest";
import { newDeleteGameUseCase } from "./delete-game.js";

test("should delete the game if it exists", async () => {
  // Arrange
  const input = {
    gameId: Game.createId("game"),
    ownedBy: User.createId("user"),
  };
  const repository = newMemoryGameRepository([
    Game.create({
      id: Game.createId("game"),
      name: GameName.create("before"),
      points: ApplicablePoints.parse("1")!,
      owner: User.createId("user"),
    })[0],
  ]);
  const useCase = newDeleteGameUseCase(repository);

  // Act
  const ret = await useCase(input);

  // Assert

  if (ret.kind == "success") {
    const saved = await repository.findBy(ret.game.id);
    expect(saved).toBeUndefined();
  } else {
    expect.fail("should be success");
  }
});

test("should fail if repository throws error", async () => {
  // Arrange
  const input = {
    gameId: Game.createId("id"),
    ownedBy: User.createId(),
  };
  const repository: GameRepository.T = {
    ...newMemoryGameRepository([
      Game.create({
        id: input.gameId,
        name: GameName.create("name"),
        points: ApplicablePoints.parse("1,3")!,
        owner: input.ownedBy,
      })[0],
    ]),
    delete: sinon.fake.throws("error"),
  };
  const useCase = newDeleteGameUseCase(repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toEqual("failed");
});

test("get error if the game do not owned", async () => {
  // Arrange
  const input = {
    gameId: Game.createId("game"),
    ownedBy: User.createId(),
  };
  const repository = newMemoryGameRepository([
    Game.create({
      id: Game.createId("game"),
      owner: User.createId("other"),
      name: GameName.create("foo"),
      points: ApplicablePoints.create([StoryPoint.create(1)]),
    })[0],
  ]);
  const useCase = newDeleteGameUseCase(repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toEqual("doNotOwned");
});
