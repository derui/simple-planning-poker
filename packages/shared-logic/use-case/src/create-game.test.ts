import { ApplicablePoints, DomainEvent, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { clear } from "@spp/shared-domain/mock/game-repository";
import * as sinon from "sinon";
import { beforeEach, expect, test } from "vitest";
import { CreateGameUseCase } from "./create-game.js";
import { clearSubsctiptions, subscribe } from "./event-dispatcher.js";

beforeEach(() => {
  clear();
  clearSubsctiptions();
});

test("should return error if numbers is invalid", async () => {
  // Arrange
  const input = {
    name: "foo",
    points: [],
    createdBy: User.createId(),
  };

  // Act
  const ret = await CreateGameUseCase(input);

  // Assert
  expect(ret).toEqual({ kind: "error", detail: "invalidStoryPoints" });
});

test("should return error if name is invalid", async () => {
  // Arrange
  const input = {
    name: "   ",
    points: [1],
    createdBy: User.createId(),
  };

  // Act
  const ret = await CreateGameUseCase(input);

  // Assert
  expect(ret).toEqual({ kind: "error", detail: "invalidName" });
});

test("should return error if numbers contains invalid story point", async () => {
  // Arrange
  const input = {
    name: "foo",
    points: [-1],
    createdBy: User.createId(),
  };

  // Act
  const ret = await CreateGameUseCase(input);

  // Assert
  expect(ret).toEqual({ kind: "error", detail: "invalidStoryPoints" });
});

test("should save new game into repository", async () => {
  // Arrange
  const input = {
    name: "foo",
    points: [1],
    createdBy: User.createId(),
  };

  // Act
  const ret = await CreateGameUseCase(input);

  // Assert

  if (ret.kind == "success") {
    const saved = await GameRepository.findBy({ id: ret.game.id });
    expect(saved!.name).toEqual("foo");
    expect(saved!.owner).toEqual(input.createdBy);
  } else {
    expect.fail("should be success");
  }
});

test("should dispatch game created event", async () => {
  // Arrange
  const input = {
    name: "foo",
    points: [1],
    createdBy: User.createId(),
  };

  const dispatcher = sinon.fake<DomainEvent.T[]>();
  subscribe(dispatcher);

  // Act
  const ret = await CreateGameUseCase(input);

  // Assert
  expect(ret.kind).toBe("success");
  expect(dispatcher.callCount).toBe(1);

  const firstArg = dispatcher.lastCall.args[0];
  if (Game.isGameCreated(firstArg)) {
    expect(firstArg.name).toBe("foo");
    expect(firstArg.createdBy).toEqual(input.createdBy);
    expect(firstArg.applicablePoints).toEqual(ApplicablePoints.create([StoryPoint.create(1)]));
  } else {
    expect.fail("should be GameCreated");
  }
});

test("get error if some games having same name already exist", async () => {
  // Arrange
  const input = {
    name: "foo",
    points: [1],
    createdBy: User.createId(),
  };

  await GameRepository.save({
    game: Game.create({
      id: Game.createId(),
      owner: input.createdBy,
      name: GameName.create("foo"),
      points: ApplicablePoints.create([StoryPoint.create(1)]),
    })[0],
  });

  // Act
  const ret = await CreateGameUseCase(input);

  // Assert
  expect(ret).toEqual({ kind: "error", detail: "conflictName" });
});
