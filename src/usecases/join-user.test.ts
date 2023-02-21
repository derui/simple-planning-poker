import { test, expect } from "vitest";
import * as sinon from "sinon";
import { EventFactory } from "@/domains/event";
import { createGameId } from "@/domains/game";
import { createGamePlayerId } from "@/domains/game-player";
import { createUser, createUserId } from "@/domains/user";
import { createMockedDispatcher, createMockedUserRepository } from "@/test-lib";
import { JoinUserUseCase } from "./join-user";

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    userId: createUserId(),
    signature: "a",
  };
  const dispatcher = createMockedDispatcher();
  const userRepository = createMockedUserRepository();
  const joinService = {
    join: () => Promise.resolve(undefined),
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
  const userRepository = createMockedUserRepository({
    findBy: sinon.fake.returns(Promise.resolve(user)),
  });
  const joinService = {
    join: async () => EventFactory.userInvited(createGamePlayerId(), gameId, user.id),
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

  const dispatch = sinon.fake();
  const dispatcher = createMockedDispatcher({ dispatch });
  const userRepository = createMockedUserRepository({
    findBy: sinon.fake.resolves(user),
  });
  const joinService = {
    join: async () => EventFactory.userInvited(createGamePlayerId(), gameId, user.id),
  };
  const useCase = new JoinUserUseCase(dispatcher, userRepository, joinService);

  // Act
  await useCase.execute(input);

  // Assert
  expect(dispatch.callCount).toBe(1);
});
