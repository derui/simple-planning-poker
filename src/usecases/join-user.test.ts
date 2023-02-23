import { test, expect } from "vitest";
import * as sinon from "sinon";
import * as EventFactory from "@/domains/event-factory";
import * as Game from "@/domains/game";
import * as GamePlayer from "@/domains/game-player";
import * as User from "@/domains/user";
import * as Invitation from "@/domains/invitation";
import { createMockedDispatcher, createMockedUserRepository } from "@/test-lib";
import { JoinUserUseCase } from "./join-user";

test("should return error if user not found", async () => {
  // Arrange
  const signature = Invitation.create(Game.createId()).signature;
  const input = {
    userId: User.createId(),
    signature: signature,
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
  const gameId = Game.createId();
  const signature = Invitation.create(gameId).signature;
  const user = User.createUser({ id: User.createId(), name: "test", joinedGames: [] });
  const input = {
    signature: signature,
    userId: user.id,
  };

  const dispatcher = createMockedDispatcher();
  const userRepository = createMockedUserRepository({
    findBy: sinon.fake.returns(Promise.resolve(user)),
  });
  const joinService = {
    join: async () => EventFactory.userInvited(GamePlayer.createId(), gameId, user.id),
  };
  const useCase = new JoinUserUseCase(dispatcher, userRepository, joinService);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toBe("success");
});

test("should dispatch event to be joined by user", async () => {
  // Arrange
  const gameId = Game.createId();
  const signature = Invitation.create(gameId).signature;
  const user = User.createUser({ id: User.createId(), name: "test", joinedGames: [] });
  const input = {
    signature: signature,
    userId: user.id,
  };

  const dispatch = sinon.fake();
  const dispatcher = createMockedDispatcher({ dispatch });
  const userRepository = createMockedUserRepository({
    findBy: sinon.fake.resolves(user),
  });
  const joinService = {
    join: async () => EventFactory.userInvited(GamePlayer.createId(), gameId, user.id),
  };
  const useCase = new JoinUserUseCase(dispatcher, userRepository, joinService);

  // Act
  await useCase.execute(input);

  // Assert
  expect(dispatch.callCount).toBe(1);
});
