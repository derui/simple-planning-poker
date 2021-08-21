import { GameCreated } from "@/domains/event";
import { Game } from "@/domains/game";
import { createSelectableCards } from "@/domains/selectable-cards";
import { createStoryPoint } from "@/domains/story-point";
import { createUserId } from "@/domains/user";
import { CreateGameUseCase } from "./create-game";
import { createMockedDispatcher, createMockedGameRepository } from "@/lib.test";

describe("use case", () => {
  describe("create game", () => {
    test("should return error if numbers is invalid", () => {
      // Arrange
      const input = {
        name: "foo",
        points: [],
        createdBy: {
          userId: createUserId(),
          name: "user",
        },
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
        createdBy: {
          userId: createUserId(),
          name: "user",
        },
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
        createdBy: {
          userId: createUserId(),
          name: "user",
        },
      };
      const dispatcher = createMockedDispatcher();
      const repository = createMockedGameRepository();
      const useCase = new CreateGameUseCase(dispatcher, repository);

      // Act
      const ret = useCase.execute(input);

      // Assert
      expect(ret.kind).toBe("success");
      expect(repository.save).toBeCalledTimes(1);

      const called = repository.save.mock.calls[0][0] as Game;
      expect(called.name).toBe("foo");
      expect(called.joinedUsers).toContain(input.createdBy.userId);
    });

    test("should dispatch game created event", () => {
      // Arrange
      const input = {
        name: "foo",
        points: [1],
        createdBy: {
          userId: createUserId(),
          name: "user",
        },
      };
      const dispatcher = createMockedDispatcher();
      const repository = createMockedGameRepository();
      const useCase = new CreateGameUseCase(dispatcher, repository);

      // Act
      const ret = useCase.execute(input);

      // Assert
      expect(ret.kind).toBe("success");
      expect(dispatcher.dispatch).toBeCalledTimes(1);

      const called = dispatcher.dispatch.mock.calls[0][0] as GameCreated;
      expect(called.name).toBe("foo");
      expect(called.createdBy).toEqual(input.createdBy);
      expect(called.selectableCards).toEqual(createSelectableCards([createStoryPoint(1)]));
    });
  });
});
