import { test, expect } from "vitest";
import * as sinon from "sinon";
import { NewRoundUseCase } from "./new-round";
import * as Game from "@/domains/game";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";
import * as Round from "@/domains/round";
import { createMockedDispatcher, createMockedGameRepository, createMockedRoundRepository } from "@/test-lib";
import { DOMAIN_EVENTS } from "@/domains/event";

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    gameId: Game.createId(),
  };

  const roundRepository = createMockedRoundRepository();
  const repository = createMockedGameRepository();
  const dispatcher = createMockedDispatcher();

  const useCase = new NewRoundUseCase(dispatcher, repository, roundRepository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toEqual("notFound");
});

test("should save game showed down", async () => {
  // Arrange
  const cards = SelectableCards.create([StoryPoint.create(1)]);
  const [game] = Game.create({
    id: Game.createId(),
    name: "name",
    owner: User.createId(),
    round: Round.createId(),
    finishedRounds: [],
    cards,
  });

  const input = {
    gameId: game.id,
  };
  const roundRepository = createMockedRoundRepository();
  const repository = createMockedGameRepository({
    findBy: sinon.fake.resolves(game),
  });
  const dispatcher = createMockedDispatcher();

  const useCase = new NewRoundUseCase(dispatcher, repository, roundRepository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toEqual("success");
});

test("should dispatch NewRound event", async () => {
  const cards = SelectableCards.create([StoryPoint.create(1)]);
  const [game] = Game.create({
    id: Game.createId(),
    name: "name",
    owner: User.createId(),
    finishedRounds: [],
    cards,
    round: Round.createId(),
  });

  const input = {
    gameId: game.id,
  };
  const roundRepository = createMockedRoundRepository();
  const repository = createMockedGameRepository({
    findBy: sinon.fake.resolves(game),
  });
  const dispatch = sinon.fake();
  const dispatcher = createMockedDispatcher({
    dispatch,
  });

  const useCase = new NewRoundUseCase(dispatcher, repository, roundRepository);

  // Act
  await useCase.execute(input);

  // Assert
  expect(dispatch.callCount).toBe(1);
  expect(dispatch.lastCall.lastArg.kind).toBe(DOMAIN_EVENTS.NewRoundStarted);
  expect(dispatch.lastCall.lastArg.roundId).not.toBe(game.round);
  expect(dispatch.lastCall.lastArg.gameId).toEqual(game.id);
});
