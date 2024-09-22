import { test, expect } from "vitest";
import * as sinon from "sinon";
import { newCreateGameUseCase } from "./create-game.js";
import { ApplicablePoints, DomainEvent, StoryPoint, User, Game, GameRepository } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";

test("should return error if numbers is invalid", async () => {
  // Arrange
  const input = {
    name: "foo",
    points: [],
    createdBy: User.createId(),
  };
  const dispatcher = sinon.fake();
  const repository = newMemoryGameRepository();
  const useCase = newCreateGameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toBe("invalidStoryPoints");
});

test("should return error if numbers contains invalid story point", async () => {
  // Arrange
  const input = {
    name: "foo",
    points: [-1],
    createdBy: User.createId(),
  };
  const dispatcher = sinon.fake();
  const repository = newMemoryGameRepository();
  const useCase = newCreateGameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toBe("invalidStoryPoint");
});

test("should save new game into repository", async () => {
  // Arrange
  const input = {
    name: "foo",
    points: [1],
    createdBy: User.createId(),
  };
  const dispatcher = sinon.fake();
  const repository = newMemoryGameRepository();
  const useCase = newCreateGameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase(input);

  // Assert

  if (ret.kind == "success") {
    const saved = await repository.findBy(ret.game.id);
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
  const repository = newMemoryGameRepository();
  const useCase = newCreateGameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase(input);

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
test("should fail if repository throws error", async () => {
  // Arrange
  const input = {
    name: "foo",
    points: [1],
    createdBy: User.createId(),
  };
  const dispatcher = sinon.fake();
  const repository: GameRepository.T = {
    ...newMemoryGameRepository(),
    save: sinon.fake.throws("error"),
  };
  const useCase = newCreateGameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toEqual("failed");
});
