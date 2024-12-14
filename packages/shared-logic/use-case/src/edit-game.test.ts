import { ApplicablePoints, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { clear } from "@spp/shared-domain/mock/game-repository";
import { beforeEach, expect, test } from "vitest";
import { EditGameUseCase } from "./edit-game.js";
import { clearSubsctiptions } from "./event-dispatcher.js";

beforeEach(() => {
  clear();
  clearSubsctiptions();
});

test("should return error if numbers is invalid", async () => {
  // Arrange
  const input = {
    gameId: Game.createId("game"),
    name: "foo",
    points: [],
    ownedBy: User.createId(),
  };

  // Act
  const ret = await EditGameUseCase(input);

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

  // Act
  const ret = await EditGameUseCase(input);

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

  // Act
  const ret = await EditGameUseCase(input);

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
  await GameRepository.save({
    game: Game.create({
      id: Game.createId("game"),
      name: GameName.create("before"),
      points: ApplicablePoints.parse("1")!,
      owner: User.createId("user"),
    })[0],
  });

  // Act
  const ret = await EditGameUseCase(input);

  // Assert

  if (ret.kind == "success") {
    const saved = await GameRepository.findBy({ id: ret.game.id });
    expect(saved!.name).toEqual("foo");
    expect(saved!.points).toEqual(ApplicablePoints.parse("1,3"));
  } else {
    expect.fail("should be success");
  }
});

test("get error if some games having same name already exist", async () => {
  // Arrange
  const input = {
    gameId: Game.createId(),
    name: "foo",
    points: [1, 3],
    ownedBy: User.createId(),
  };

  await Promise.all(
    [
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
    ].map((game) => GameRepository.save({ game }))
  );

  // Act
  const ret = await EditGameUseCase(input);

  // Assert
  expect(ret.kind).toEqual("conflictName");
});
