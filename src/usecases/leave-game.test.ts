import { test, expect } from "vitest";
import sinon from "sinon";
import * as Game from "@/domains/game";
import * as GamePlayer from "@/domains/game-player";
import * as User from "@/domains/user";
import { createMockedDispatcher, createMockedUserRepository } from "@/test-lib";
import { LeaveGameUseCase } from "./leave-game";

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    gameId: Game.createId(),
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
  const gameId = Game.createId();
  const user = User.createUser({ id: User.createId(), name: "test", joinedGames: [] });
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
  const gameId = Game.createId();
  const playerId = GamePlayer.createId();
  const user = User.createUser({ id: User.createId(), name: "test", joinedGames: [{ gameId, playerId }] });
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
  const gameId = Game.createId();
  const playerId = GamePlayer.createId();
  const user = User.createUser({ id: User.createId(), name: "test", joinedGames: [{ gameId, playerId }] });
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
