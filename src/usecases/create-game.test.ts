import { test, expect } from "vitest";
import { create } from "@/domains/selectable-cards";
import { create } from "@/domains/story-point";
import { createId } from "@/domains/user";
import { CreateGameUseCase } from "./create-game";
import { createMockedDispatcher, createMockedGameRepository } from "@/test-lib";
import * as sinon from "sinon";

test("should return error if numbers is invalid", () => {
  // Arrange
  const input = {
    name: "foo",
    points: [],
    createdBy: createId(),
  };
  const dispatcher = createMockedDispatcher();
  const repository = createMockedGameRepository();
  const useCase = new CreateGameUseCase(dispatcher, repository);

  // Act
  const ret = useCase.execute(input);

  // Assert
  expect(ret.kind).toBe("invalidStoryPoints");
});

test("should return error if numbers contains invalid story point", () => {
  // Arrange
  const input = {
    name: "foo",
    points: [-1],
    createdBy: createId(),
  };
  const dispatcher = createMockedDispatcher();
  const repository = createMockedGameRepository();
  const useCase = new CreateGameUseCase(dispatcher, repository);

  // Act
  const ret = useCase.execute(input);

  // Assert
  expect(ret.kind).toBe("invalidStoryPoint");
});

test("should save new game into repository", () => {
  // Arrange
  const input = {
    name: "foo",
    points: [1],
    createdBy: createId(),
  };
  const dispatcher = createMockedDispatcher();
  const save = sinon.fake();
  const repository = createMockedGameRepository({
    save,
  });
  const useCase = new CreateGameUseCase(dispatcher, repository);

  // Act
  useCase.execute(input);

  // Assert
  expect(save.callCount).toBe(1);
  expect(save.lastCall.firstArg.name).toBe("foo");
});

test("should dispatch game created event", () => {
  // Arrange
  const input = {
    name: "foo",
    points: [1],
    createdBy: createId(),
  };
  const dispatch = sinon.fake();
  const dispatcher = createMockedDispatcher({
    dispatch,
  });
  const repository = createMockedGameRepository();
  const useCase = new CreateGameUseCase(dispatcher, repository);

  // Act
  const ret = useCase.execute(input);

  // Assert
  expect(ret.kind).toBe("success");
  expect(dispatch.callCount).toBe(1);
  expect(dispatch.lastCall.firstArg.name).toBe("foo");
  expect(dispatch.lastCall.firstArg.createdBy.userId).toEqual(input.createdBy);
  expect(dispatch.lastCall.firstArg.selectableCards.cards).toEqual(create([create(1)]).cards);
});
