import { EventFactory } from "@/domains/event";
import { createGameId } from "@/domains/game";
import { createGamePlayerId } from "@/domains/game-player";
import { createUser, createUserId } from "@/domains/user";
import { createMockedDispatcher, createMockedUserRepository } from "@/lib.test";
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
      const user = createUser({ id: createUserId(), name: "test" });
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
      const user = createUser({ id: createUserId(), name: "test" });
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
