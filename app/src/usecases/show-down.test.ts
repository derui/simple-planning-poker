import { test, expect } from "vitest";
import sinon from "sinon";
import { ShowDownUseCase } from "./show-down";
import * as User from "@/domains/user";
import * as Round from "@/domains/round";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as UserEstimation from "@/domains/user-estimation";

import { createMockedDispatcher, createMockedRoundRepository, randomRound } from "@/test-lib";
import { DOMAIN_EVENTS } from "@/domains/event";

const CARDS = SelectableCards.create([StoryPoint.create(1)]);

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    roundId: Round.createId(),
  };
  const repository = createMockedRoundRepository();
  const dispatcher = createMockedDispatcher();

  const useCase = new ShowDownUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret).toEqual({ kind: "notFoundGame" });
});

test("should save game showed down", async () => {
  // Arrange
  const owner = User.createId();
  const round = randomRound({ cards: CARDS });

  const changed = Round.takePlayerEstimation(round, owner, UserEstimation.giveUp());

  const input = {
    roundId: round.id,
  };
  const save = sinon.fake.resolves(undefined);
  const repository = createMockedRoundRepository({
    findBy: sinon.fake.resolves(changed),
    save,
  });
  const dispatcher = createMockedDispatcher();

  const useCase = new ShowDownUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret).toEqual({ kind: "success", round: save.lastCall.firstArg });
});

test("should return error if the round can not show down", async () => {
  // Arrange
  const round = randomRound({ cards: CARDS });

  const input = {
    roundId: round.id,
  };
  const repository = createMockedRoundRepository({
    findBy: sinon.fake.resolves(round),
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
  const owner = User.createId();
  const round = randomRound({ cards: CARDS });
  const changed = Round.takePlayerEstimation(round, owner, UserEstimation.giveUp());

  const input = {
    roundId: round.id,
  };
  const repository = createMockedRoundRepository({
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
