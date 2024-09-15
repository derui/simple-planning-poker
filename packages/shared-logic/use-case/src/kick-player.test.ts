import { test, expect } from "vitest";
import sinon from "sinon";
import { newKickPlayerUseCase } from "./kick-player.js";
import { Game, User, Voting, ApplicablePoints, StoryPoint, DomainEvent } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";

test("should return error if game not found", async () => {
  // Arrange
  const input = {
    gameId: Game.createId(),
    requestedUserId: User.createId(),
    targetUserId: User.createId(),
  };
  const gameRepository = newMemoryGameRepository();
  const dispatcher = sinon.fake();
  const useCase = newKickPlayerUseCase(dispatcher, gameRepository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret).toEqual({ kind: "notFoundGame" });
});

test("should success to kick player from the game by owner", async () => {
  // Arrange
  const gameId = Game.createId();
  const user = User.create({ id: User.createId(), name: "test" });
  let game = Game.create({
    id: gameId,
    name: "name",
    points: ApplicablePoints.create([StoryPoint.create(1)]),
    owner: User.createId("id"),
    voting: Voting.createId(),
  })[0];
  game = Game.joinUserAsPlayer(game, user.id, Game.makeInvitation(game))[0];

  const gameRepository = newMemoryGameRepository([game]);
  const dispatcher = sinon.fake<DomainEvent.T[]>();

  const useCase = newKickPlayerUseCase(dispatcher, gameRepository);

  // Act
  const input = {
    gameId,
    requestedUserId: game.owner,
    targetUserId: user.id,
  };
  const ret = await useCase(input);

  // Assert
  const saved = await gameRepository.findBy(gameId);
  expect(ret).toEqual({ kind: "success", game: saved });
  expect(dispatcher.callCount).toBe(1);

  const event = dispatcher.lastCall.args[0];
  if (Game.isUserLeftFromGame(event)) {
    expect(event.gameId).toBe(game.id);
    expect(event.userId).toEqual(user.id);
  } else {
    expect.fail("event should be UserLeftFromGame");
  }
});

test("should return error when a user is not owner of the game", async () => {
  // Arrange
  const gameId = Game.createId();
  const user = User.create({ id: User.createId(), name: "test" });

  const game = Game.create({
    id: gameId,
    name: "name",
    points: ApplicablePoints.create([StoryPoint.create(1)]),
    owner: user.id,
    voting: Voting.createId(),
  })[0];

  const gameRepository = newMemoryGameRepository([game]);
  const dispatcher = sinon.fake();
  const useCase = newKickPlayerUseCase(dispatcher, gameRepository);

  // Act
  const input = {
    gameId,
    requestedUserId: User.createId("other"),
    targetUserId: user.id,
  };
  const ret = await useCase(input);

  // Assert
  expect(ret).toEqual({ kind: "canNotKickByPlayer" });
});
