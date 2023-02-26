import { test, expect } from "vitest";
import * as sinon from "sinon";
import * as Game from "@/domains/game";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";
import { createMockedGameRepository } from "@/test-lib";
import { HandCardUseCase } from "./hand-card";
import * as UserHand from "@/domains/user-hand";

const CARDS = SelectableCards.create([StoryPoint.create(1)]);

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    gameId: Game.createId(),
    userHand: UserHand.handed(CARDS[0]),
  };

  const repository = createMockedGameRepository();

  const useCase = new HandCardUseCase(repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret).toEqual({ kind: "notFoundGame" });
});

test("should save player with card selected by user", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    gameId: Game.createId(),
    userHand: UserHand.handed(CARDS[0]),
  };
  let [game] = Game.create({
    id: input.gameId,
    name: "name",
    joinedPlayers: [],
    owner: input.userId,
    finishedRounds: [],
    cards: CARDS,
  });

  const save = sinon.fake();
  const repository = createMockedGameRepository({
    save,
    findBy: sinon.fake.resolves(game),
  });

  // Act
  const useCase = new HandCardUseCase(repository);
  const ret = await useCase.execute(input);

  // Assert
  expect(ret).toEqual({ kind: "success", game: save.lastCall.firstArg });
  expect(save.callCount).toBe(1);
  expect(save.lastCall.firstArg.round.hands).toEqual(Object.fromEntries([[input.userId, UserHand.handed(CARDS[0])]]));
});
