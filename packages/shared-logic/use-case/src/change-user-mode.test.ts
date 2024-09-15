import { test, expect } from "vitest";
import { newChangeUserModeUseCase } from "./change-user-mode.js";
import { User, Game, Voting, GamePlayer, ApplicablePoints, StoryPoint } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    gameId: Game.createId(),
    mode: GamePlayer.UserMode.Inspector,
  };

  const repository = newMemoryGameRepository();
  const useCase = newChangeUserModeUseCase(repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toBe("notFound");
});

test("should save game", async () => {
  // Arrange
  const userId = User.createId();
  const input = {
    userId,
    gameId: Game.createId(),
    mode: GamePlayer.UserMode.Inspector,
  };

  const game = Game.create({
    id: input.gameId,
    name: "name",
    points: ApplicablePoints.create([StoryPoint.create(1)]),
    owner: userId,
    voting: Voting.createId(),
  })[0];

  const repository = newMemoryGameRepository([game]);

  const useCase = newChangeUserModeUseCase(repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toBe("success");

  const saved = await repository.findBy(input.gameId);
  expect(saved?.joinedPlayers?.find((v) => v.user == userId)?.mode).toBe(GamePlayer.UserMode.Inspector);
});
