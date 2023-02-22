import { test, expect } from "vitest";
import sinon from "sinon";
import { createId } from "@/domains/game";
import { createId } from "@/domains/game-player";
import { createUser, createId } from "@/domains/user";
import { createMockedDispatcher, createMockedUserRepository } from "@/test-lib";
import { LeaveGameUseCase } from "./leave-game";

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    userId: createId(),
    gameId: createId(),
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
  const gameId = createId();
  const user = createUser({ id: createId(), name: "test", joinedGames: [] });
  const input = {
    gameId,
    userId: user.id,
  };

  const dispatcher = createMockedDispatcher();
  const userRepository = createMockedUserRepository({
    findBy: sinon.fake.resolves(user),
  });
  const useCase = new LeaveGameUseCase(dispatcher, userRepository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toBe("leaveFailed");
});

test("should return success if user leaved from a game", async () => {
  // Arrange
  const gameId = createId();
  const playerId = createId();
  const user = createUser({ id: createId(), name: "test", joinedGames: [{ gameId, playerId }] });
  const input = {
    gameId,
    userId: user.id,
  };

  const dispatcher = createMockedDispatcher();
  const userRepository = createMockedUserRepository({
    findBy: sinon.fake.resolves(user),
  });
  const useCase = new LeaveGameUseCase(dispatcher, userRepository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toBe("success");
});

test("should dispatch event to be joined by user", async () => {
  // Arrange
  const gameId = createId();
  const playerId = createId();
  const user = createUser({ id: createId(), name: "test", joinedGames: [{ gameId, playerId }] });
  const input = {
    gameId,
    userId: user.id,
  };

  const dispatch = sinon.fake();
  const dispatcher = createMockedDispatcher({ dispatch });
  const userRepository = createMockedUserRepository({
    findBy: sinon.fake.resolves(user),
  });

  const useCase = new LeaveGameUseCase(dispatcher, userRepository);

  // Act
  await useCase.execute(input);

  // Assert
  expect(dispatch.callCount).toBe(1);
});
