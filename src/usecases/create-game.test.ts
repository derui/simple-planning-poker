import { test, expect } from "vitest";
import * as sinon from "sinon";
import { CreateGameUseCase } from "./create-game";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";
import { createMockedDispatcher, createMockedGameRepository } from "@/test-lib";

test("should return error if numbers is invalid", async () => {
  // Arrange
  const input = {
    name: "foo",
    points: [],
    createdBy: User.createId(),
  };
  const dispatcher = createMockedDispatcher();
  const repository = createMockedGameRepository();
  const useCase = new CreateGameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

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
  const dispatcher = createMockedDispatcher();
  const repository = createMockedGameRepository();
  const useCase = new CreateGameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

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
  const dispatcher = createMockedDispatcher();
  const save = sinon.fake();
  const repository = createMockedGameRepository({
    save,
  });
  const useCase = new CreateGameUseCase(dispatcher, repository);

  // Act
  await useCase.execute(input);

  // Assert
  expect(save.callCount).toBe(1);
  expect(save.lastCall.firstArg.name).toBe("foo");
});

test("should dispatch game created event", async () => {
  // Arrange
  const input = {
    name: "foo",
    points: [1],
    createdBy: User.createId(),
  };
  const dispatch = sinon.fake();
  const dispatcher = createMockedDispatcher({
    dispatch,
  });
  const repository = createMockedGameRepository();
  const useCase = new CreateGameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toBe("success");
  expect(dispatch.callCount).toBe(1);
  expect(dispatch.lastCall.firstArg.name).toBe("foo");
  expect(dispatch.lastCall.firstArg.createdBy).toEqual(input.createdBy);
  expect(dispatch.lastCall.firstArg.selectableCards).toEqual(SelectableCards.create([StoryPoint.create(1)]));
});
