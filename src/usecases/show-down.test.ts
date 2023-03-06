import { test, expect } from "vitest";
import sinon from "sinon";
import { ShowDownUseCase } from "./show-down";
import * as Game from "@/domains/game";
import * as User from "@/domains/user";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as UserHand from "@/domains/user-hand";

import { createMockedDispatcher, createMockedGameRepository } from "@/test-lib";
import { DOMAIN_EVENTS } from "@/domains/event";

const CARDS = SelectableCards.create([StoryPoint.create(1)]);

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    gameId: Game.createId(),
  };
  const repository = createMockedGameRepository();
  const dispatcher = createMockedDispatcher();

  const useCase = new ShowDownUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret).toEqual({ kind: "notFoundGame" });
});

test("should save game showed down", async () => {
  // Arrange

  const [game] = Game.create({
    id: Game.createId(),
    name: "name",
    joinedPlayers: [],
    owner: User.createId(),
    finishedRounds: [],
    cards: CARDS,
  });

  const changed = Game.acceptPlayerHand(game, game.owner, UserHand.giveUp());

  const input = {
    gameId: game.id,
  };
  const save = sinon.fake.resolves(undefined);
  const repository = createMockedGameRepository({
    findBy: sinon.fake.resolves(changed),
    save,
  });
  const dispatcher = createMockedDispatcher();

  const useCase = new ShowDownUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret).toEqual({ kind: "success", output: save.lastCall.firstArg });
});

test("should return error if the game can not show down", async () => {
  // Arrange

  const [game] = Game.create({
    id: Game.createId(),
    name: "name",
    joinedPlayers: [],
    owner: User.createId(),
    finishedRounds: [],
    cards: CARDS,
  });

  const input = {
    gameId: game.id,
  };
  const repository = createMockedGameRepository({
    findBy: sinon.fake.resolves(game),
  });
  const dispatcher = createMockedDispatcher();

  const useCase = new ShowDownUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret).toEqual({ kind: "showDownFailed" });
});

test("should dispatch ShowedDown event", async () => {
  // Arrange
  const [game] = Game.create({
    id: Game.createId(),
    name: "name",
    joinedPlayers: [],
    owner: User.createId(),
    finishedRounds: [],
    cards: CARDS,
  });
  const changed = Game.acceptPlayerHand(game, game.owner, UserHand.giveUp());

  const input = {
    gameId: game.id,
  };
  const repository = createMockedGameRepository({
    findBy: sinon.fake.resolves(changed),
  });
  const dispatch = sinon.fake();
  const dispatcher = createMockedDispatcher({
    dispatch,
  });

  const useCase = new ShowDownUseCase(dispatcher, repository);

  // Act
  await useCase.execute(input);

  // Assert
  expect(dispatch.callCount).toBe(1);
  expect(dispatch.lastCall.firstArg.kind).toBe(DOMAIN_EVENTS.RoundFinished);
});
