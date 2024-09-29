import { test, expect } from "vitest";
import sinon from "sinon";
import { newLeaveGameUseCase } from "./leave-game.js";
import { Game, User, Voting, ApplicablePoints, StoryPoint, DomainEvent } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    gameId: Game.createId(),
  };
  const gameRepository = newMemoryGameRepository();
  const dispatcher = sinon.fake();
  const useCase = newLeaveGameUseCase(gameRepository, dispatcher);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret).toEqual({ kind: "notFound" });
});

test("should return success if user leaved from a game", async () => {
  // Arrange
  const gameId = Game.createId();
  const user = User.create({ id: User.createId(), name: "test" });
  const input = {
    gameId,
    userId: user.id,
  };
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
  const useCase = newLeaveGameUseCase(gameRepository, dispatcher);

  // Act
  const ret = await useCase(input);

  // Assert
  const saved = await gameRepository.findBy(game.id);
  expect(ret).toEqual({ kind: "success", game: saved });
  expect(dispatcher.callCount).toBe(1);

  const event = dispatcher.lastCall.args[0];
  if (Game.isUserLeftFromGame(event)) {
    expect(event.gameId).toBe(game.id);
    expect(event.userId).toEqual(user.id);
  } else {
    expect.fail("event is not UserLeftFromGame");
  }
});

test("should return error when a user is owner of the game", async () => {
  // Arrange
  const gameId = Game.createId();
  const user = User.create({ id: User.createId(), name: "test" });
  const input = {
    gameId,
    userId: user.id,
  };
  const game = Game.create({
    id: gameId,
    name: "name",
    points: ApplicablePoints.create([StoryPoint.create(1)]),
    owner: user.id,
    voting: Voting.createId(),
  })[0];

  const gameRepository = newMemoryGameRepository([game]);
  const dispatcher = sinon.fake();
  const useCase = newLeaveGameUseCase(gameRepository, dispatcher);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret).toEqual({ kind: "ownerCanNotLeave" });
});
