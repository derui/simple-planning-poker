import { test, expect } from "vitest";
import sinon from "sinon";
import { LeaveGameUseCase } from "./leave-game";
import * as Game from "@/domains/game";
import * as User from "@/domains/user";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import { createMockedGameRepository } from "@/test-lib";

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    gameId: Game.createId(),
  };
  const gameRepository = createMockedGameRepository();
  const useCase = new LeaveGameUseCase(gameRepository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret).toEqual({ kind: "notFoundGame" });
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
    cards: SelectableCards.create([StoryPoint.create(1)]),
    owner: User.createId("id"),
    finishedRounds: [],
  })[0];
  game = Game.joinUserAsPlayer(game, user.id, Game.makeInvitation(game))[0];

  const save = sinon.fake();
  const gameRepository = createMockedGameRepository({
    save,
    findBy: sinon.fake.resolves(game),
  });
  const useCase = new LeaveGameUseCase(gameRepository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret).toEqual({ kind: "success", game: save.lastCall.lastArg });
  expect(save.callCount).toBe(1);
});
