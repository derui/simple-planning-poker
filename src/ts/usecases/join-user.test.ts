import { EventFactory } from "~/src/ts/domains/event";
import { createGameId } from "~/src/ts/domains/game";
import { createGamePlayerId } from "~/src/ts/domains/game-player";
import { createUser, createUserId } from "~/src/ts/domains/user";
import { createMockedDispatcher, createMockedUserRepository } from "~/src/ts/lib.test";
import { JoinUserUseCase } from "./join-user";

describe("use case", () => {
  describe("join user", () => {
    test("should return error if user not found", async () => {
      // Arrange
      const input = {
        userId: createUserId(),
        signature: "a",
      };
      const dispatcher = createMockedDispatcher();
      const userRepository = createMockedUserRepository();
      const joinService = {
        join: jest.fn().mockImplementation(() => undefined),
      };
      const useCase = new JoinUserUseCase(dispatcher, userRepository, joinService);

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toBe("notFoundUser");
    });

    test("should save game that user joined in", async () => {
      // Arrange
      const gameId = createGameId();
      const user = createUser({ id: createUserId(), name: "test", joinedGames: [] });
      const input = {
        signature: "a",
        userId: user.id,
      };

      const dispatcher = createMockedDispatcher();
      const userRepository = createMockedUserRepository();
      userRepository.findBy.mockImplementation(() => user);
      const joinService = {
        join: jest.fn().mockImplementation(() => EventFactory.userInvited(createGamePlayerId(), gameId, user.id)),
      };
      const useCase = new JoinUserUseCase(dispatcher, userRepository, joinService);

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toBe("success");
    });

    test("should dispatch event to be joined by user", async () => {
      // Arrange
      const gameId = createGameId();
      const user = createUser({ id: createUserId(), name: "test", joinedGames: [] });
      const input = {
        signature: "a",
        userId: user.id,
      };

      const dispatcher = createMockedDispatcher();
      const userRepository = createMockedUserRepository();
      userRepository.findBy.mockImplementation(() => user);
      const joinService = {
        join: jest.fn().mockImplementation(() => EventFactory.userInvited(createGamePlayerId(), gameId, user.id)),
      };
      const useCase = new JoinUserUseCase(dispatcher, userRepository, joinService);

      // Act
      await useCase.execute(input);

      // Assert
      expect(dispatcher.dispatch).toBeCalledTimes(1);
    });
  });
});
