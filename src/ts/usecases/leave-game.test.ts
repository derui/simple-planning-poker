import { createGameId } from "@/domains/game";
import { createGamePlayerId } from "@/domains/game-player";
import { createUser, createUserId } from "@/domains/user";
import { createMockedDispatcher, createMockedUserRepository } from "@/lib.test";
import { LeaveGameUseCase } from "./leave-game";

describe("use case", () => {
  describe("leave game", () => {
    test("should return error if user not found", async () => {
      // Arrange
      const input = {
        userId: createUserId(),
        gameId: createGameId(),
      };
      const dispatcher = createMockedDispatcher();
      const userRepository = createMockedUserRepository();
      const useCase = new LeaveGameUseCase(dispatcher, userRepository);

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toBe("notFoundUser");
    });

    test("should return error if user did not join to a game", async () => {
      // Arrange
      const gameId = createGameId();
      const user = createUser({ id: createUserId(), name: "test", joinedGames: [] });
      const input = {
        gameId,
        userId: user.id,
      };

      const dispatcher = createMockedDispatcher();
      const userRepository = createMockedUserRepository();
      userRepository.findBy.mockImplementation(() => user);
      const useCase = new LeaveGameUseCase(dispatcher, userRepository);

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toBe("leaveFailed");
    });

    test("should return success if user leaved from a game", async () => {
      // Arrange
      const gameId = createGameId();
      const playerId = createGamePlayerId();
      const user = createUser({ id: createUserId(), name: "test", joinedGames: [{ gameId, playerId }] });
      const input = {
        gameId,
        userId: user.id,
      };

      const dispatcher = createMockedDispatcher();
      const userRepository = createMockedUserRepository();
      userRepository.findBy.mockImplementation(() => user);
      const useCase = new LeaveGameUseCase(dispatcher, userRepository);

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toBe("success");
    });

    test("should dispatch event to be joined by user", async () => {
      // Arrange
      const gameId = createGameId();
      const playerId = createGamePlayerId();
      const user = createUser({ id: createUserId(), name: "test", joinedGames: [{ gameId, playerId }] });
      const input = {
        gameId,
        userId: user.id,
      };

      const dispatcher = createMockedDispatcher();
      const userRepository = createMockedUserRepository();
      userRepository.findBy.mockImplementation(() => user);
      const useCase = new LeaveGameUseCase(dispatcher, userRepository);

      // Act
      await useCase.execute(input);

      // Assert
      expect(dispatcher.dispatch).toBeCalledTimes(1);
    });
  });
});
