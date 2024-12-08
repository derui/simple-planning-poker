import { ApplicablePoints, Game, GameName, GameRepository, StoryPoint, User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import * as sinon from "sinon";
import { expect, test } from "vitest";
import { newEditGameUseCase } from "./edit-game.js";

test("should return error if numbers is invalid", async () => {
  // Arrange
  const input = {
    gameId: Game.createId("game"),
    name: "foo",
    points: [],
    ownedBy: User.createId(),
  };
  const repository = newMemoryGameRepository();
  const useCase = newEditGameUseCase(repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toBe("invalidStoryPoint");
});

test("should return error if the name is invalid", async () => {
  // Arrange
  const input = {
    gameId: Game.createId("game"),
    name: "   ",
    points: [11],
    ownedBy: User.createId(),
  };
  const repository = newMemoryGameRepository();
  const useCase = newEditGameUseCase(repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toBe("invalidName");
});

test("should return error if numbers contains invalid story point", async () => {
  // Arrange
  const input = {
    gameId: Game.createId("id"),
    name: "foo",
    points: [-1],
    ownedBy: User.createId(),
  };
  const repository = newMemoryGameRepository();
  const useCase = newEditGameUseCase(repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toBe("invalidStoryPoint");
});

test("should save new game into repository", async () => {
  // Arrange
  const input = {
    gameId: Game.createId("game"),
    name: "foo",
    points: [1, 3],
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
  const useCase = newEditGameUseCase(repository);

  // Act
  const ret = await useCase(input);

  // Assert

  if (ret.kind == "success") {
    const saved = await repository.findBy(ret.game.id);
    expect(saved!.name).toEqual("foo");
    expect(saved!.points).toEqual(ApplicablePoints.parse("1,3"));
  } else {
    expect.fail("should be success");
  }
});

test("should fail if repository throws error", async () => {
  // Arrange
  const input = {
    gameId: Game.createId("id"),
    name: "foo",
    points: [1],
    ownedBy: User.createId(),
  };
  const repository: GameRepository.T = {
    ...newMemoryGameRepository([
      Game.create({
        id: input.gameId,
        name: GameName.create(input.name),
        points: ApplicablePoints.parse(input.points.join(","))!,
        owner: input.ownedBy,
      })[0],
    ]),
    save: sinon.fake.throws("error"),
  };
  const useCase = newEditGameUseCase(repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toEqual("failed");
});

test("get error if some games having same name already exist", async () => {
  // Arrange
  const input = {
    gameId: Game.createId(),
    name: "foo",
    points: [1, 3],
    ownedBy: User.createId(),
  };
  const repository = newMemoryGameRepository([
    Game.create({
      id: Game.createId(),
      owner: input.ownedBy,
      name: GameName.create("foo"),
      points: ApplicablePoints.create([StoryPoint.create(1)]),
    })[0],
    Game.create({
      id: input.gameId,
      owner: input.ownedBy,
      name: GameName.create("before"),
      points: ApplicablePoints.create([StoryPoint.create(1)]),
    })[0],
  ]);

  const useCase = newEditGameUseCase(repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toEqual("conflictName");
});
