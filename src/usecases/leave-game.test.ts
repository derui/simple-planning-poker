import { test, expect } from "vitest";
import sinon from "sinon";
import { LeaveGameUseCase } from "./leave-game";
import * as Game from "@/domains/game";
import * as User from "@/domains/user";
import * as Round from "@/domains/round";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import { createMockedDispatcher, createMockedGameRepository } from "@/test-lib";

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    gameId: Game.createId(),
  };
  const gameRepository = createMockedGameRepository();
  const dispatcher = createMockedDispatcher();
  const useCase = new LeaveGameUseCase(gameRepository, dispatcher);

  // Act
  const ret = await useCase.execute(input);

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
    cards: SelectableCards.create([StoryPoint.create(1)]),
    owner: User.createId("id"),
    round: Round.createId(),
  })[0];
  game = Game.joinUserAsPlayer(game, user.id, Game.makeInvitation(game))[0];

  const save = sinon.fake();
  const gameRepository = createMockedGameRepository({
    save,
    findBy: sinon.fake.resolves(game),
  });
  const dispatch = sinon.fake();
  const dispatcher = createMockedDispatcher({
    dispatch: dispatch,
  });
  const useCase = new LeaveGameUseCase(gameRepository, dispatcher);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret).toEqual({ kind: "success", game: save.lastCall.lastArg });
  expect(save.callCount).toBe(1);
  expect(dispatch.callCount).toBe(1);
  expect(dispatch.lastCall.firstArg.gameId).toBe(game.id);
});

test("should return error when a user is owner of the game", async () => {
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
    owner: user.id,
    round: Round.createId(),
  })[0];

  const save = sinon.fake();
  const gameRepository = createMockedGameRepository({
    save,
    findBy: sinon.fake.resolves(game),
  });
  const dispatch = sinon.fake();
  const dispatcher = createMockedDispatcher({
    dispatch: dispatch,
  });
  const useCase = new LeaveGameUseCase(gameRepository, dispatcher);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret).toEqual({ kind: "ownerCanNotLeave" });
});
