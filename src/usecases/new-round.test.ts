import { test, expect } from "vitest";
import * as sinon from "sinon";
import { NewRoundUseCase } from "./new-round";
import * as Game from "@/domains/game";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";
import * as Round from "@/domains/round";
import * as UserEstimation from "@/domains/user-estimation";
import { createMockedDispatcher, createMockedGameRepository } from "@/test-lib";
import { dateTimeToString } from "@/domains/type";
import { DOMAIN_EVENTS } from "@/domains/event";

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    gameId: Game.createId(),
  };
  const repository = createMockedGameRepository();
  const dispatcher = createMockedDispatcher();

  const useCase = new NewRoundUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toEqual("notFoundGame");
});

test("should save game showed down", async () => {
  // Arrange
  const cards = SelectableCards.create([StoryPoint.create(1)]);
  const [game] = Game.create({
    id: Game.createId(),
    name: "name",
    owner: User.createId(),
    round: Round.finishedRoundOf({
      id: Round.createId(),
      estimations: [],
      cards,
      count: 1,
      finishedAt: dateTimeToString(new Date()),
      joinedPlayers: [],
    }),
    finishedRounds: [],
    cards,
  });

  const input = {
    gameId: game.id,
  };
  const repository = createMockedGameRepository({
    findBy: sinon.fake.resolves(game),
  });
  const dispatcher = createMockedDispatcher();

  const useCase = new NewRoundUseCase(dispatcher, repository);

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
  });

  const [changed] = Game.showDown(Game.acceptPlayerEstimation(game, game.owner, UserEstimation.giveUp()), new Date());

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

  const useCase = new NewRoundUseCase(dispatcher, repository);

  // Act
  await useCase.execute(input);

  // Assert
  expect(dispatch.callCount).toBe(1);
  expect(dispatch.lastCall.lastArg.kind).toBe(DOMAIN_EVENTS.NewRoundStarted);
});
