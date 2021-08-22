import { UserJoined } from "@/domains/event";
import { createGame, createGameId } from "@/domains/game";
import { createSelectableCards } from "@/domains/selectable-cards";
import { createStoryPoint } from "@/domains/story-point";
import { createUserId } from "@/domains/user";
import { createMockedDispatcher, createMockedGameRepository } from "@/lib.test";
import { JoinUserUseCase } from "./join-user";

describe("use case", () => {
  describe("join user", () => {
    test("should return error if game not found", async () => {
      // Arrange
      const input = {
        gameId: createGameId(),
        userId: createUserId(),
        name: "foo",
      };
      const dispatcher = createMockedDispatcher();
      const repository = createMockedGameRepository();
      const useCase = new JoinUserUseCase(dispatcher, repository);

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toBe("notFoundGame");
    });

    test("should save game that user joined in", async () => {
      // Arrange
      const gameId = createGameId();
      const userId = createUserId();
      const userId2 = createUserId();
      const input = {
        gameId,
        userId: userId2,
        name: "foo",
      };

      const game = createGame(gameId, "name", [userId], createSelectableCards([createStoryPoint(1)]));

      const dispatcher = createMockedDispatcher();
      const repository = createMockedGameRepository();
      repository.findBy.mockImplementation(() => game);
      const useCase = new JoinUserUseCase(dispatcher, repository);

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toBe("success");
      expect(game.joinedUsers).toContain(userId2);
    });

    test("should dispatch event to be joined by user", async () => {
      // Arrange
      const gameId = createGameId();
      const userId = createUserId();
      const userId2 = createUserId();
      const input = {
        gameId,
        userId: userId2,
        name: "foo",
      };

      const game = createGame(gameId, "name", [userId], createSelectableCards([createStoryPoint(1)]));

      const dispatcher = createMockedDispatcher();
      const repository = createMockedGameRepository();
      repository.findBy.mockImplementation(() => game);
      const useCase = new JoinUserUseCase(dispatcher, repository);

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toBe("success");
      expect(dispatcher.dispatch).toBeCalledTimes(1);

      const called = dispatcher.dispatch.mock.calls[0][0] as UserJoined;
      expect(called.gameId).toEqual(gameId);
      expect(called.userId).toEqual(userId2);
    });
  });
});
