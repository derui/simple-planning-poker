import { test, expect } from "vitest";
import * as sinon from "sinon";
import { newJoinUserUseCase } from "./join-user.js";
import { Game, User, Invitation, ApplicablePoints, StoryPoint, Voting, DomainEvent } from "@spp/shared-domain";
import { newMemoryUserRepository } from "@spp/shared-domain/mock/user-repository";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";

test("should return error if user not found", async () => {
  // Arrange
  const signature = Invitation.create(Game.createId());
  const input = {
    userId: User.createId(),
    signature: signature,
  };
  const dispatcher = sinon.fake();
  const userRepository = newMemoryUserRepository();
  const gameRepository = newMemoryGameRepository();
  const useCase = newJoinUserUseCase(dispatcher, userRepository, gameRepository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret).toEqual({ kind: "notFoundUser" });
});

test("should be error when signature is invalid", async () => {
  // Arrange
  const gameId = Game.createId();
  const signature = Invitation.create(gameId);
  const user = User.create({ id: User.createId(), name: "test" });
  const input = {
    signature: signature,
    userId: user.id,
    gameId,
  };

  const dispatcher = sinon.fake();
  const userRepository = newMemoryUserRepository([user]);
  const gameRepository = newMemoryGameRepository();
  const useCase = newJoinUserUseCase(dispatcher, userRepository, gameRepository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret).toEqual({ kind: "notFoundGame" });
});

test("should save game that user joined in", async () => {
  // Arrange
  const gameId = Game.createId();
  const signature = Invitation.create(gameId);
  const user = User.create({ id: User.createId(), name: "test" });
  const input = {
    signature: signature,
    userId: user.id,
    gameId,
  };

  const game = Game.create({
    id: input.gameId,
    name: "name",
    points: ApplicablePoints.create([StoryPoint.create(1)]),
    owner: User.createId("owner"),
    voting: Voting.createId(),
  })[0];

  const dispatcher = sinon.fake();
  const userRepository = newMemoryUserRepository([user]);
  const gameRepository = newMemoryGameRepository([game]);
  const useCase = newJoinUserUseCase(dispatcher, userRepository, gameRepository);

  // Act
  const ret = await useCase(input);

  // Assert
  const saved = await gameRepository.findBy(game.id);
  expect(ret).toEqual({ kind: "success", game: saved! });
});

test("should dispatch event to be joined by user", async () => {
  // Arrange
  const gameId = Game.createId();
  const signature = Invitation.create(gameId);
  const user = User.create({ id: User.createId(), name: "test" });
  const input = {
    signature: signature,
    userId: user.id,
    gameId,
  };

  const game = Game.create({
    id: input.gameId,
    name: "name",
    points: ApplicablePoints.create([StoryPoint.create(1)]),
    owner: User.createId("owner"),
    voting: Voting.createId(),
  })[0];

  const dispatcher = sinon.fake<DomainEvent.T[]>();
  const userRepository = newMemoryUserRepository([user]);
  const gameRepository = newMemoryGameRepository([game]);
  const useCase = newJoinUserUseCase(dispatcher, userRepository, gameRepository);

  // Act
  await useCase(input);

  // Assert
  expect(dispatcher.callCount).toBe(1);
  expect(dispatcher.lastCall.args[0]).toEqual({
    kind: DomainEvent.DOMAIN_EVENTS.UserJoined,
    userId: user.id,
    gameId: game.id,
  });
});
