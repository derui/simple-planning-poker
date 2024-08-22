import { test, expect } from "vitest";
import * as sinon from "sinon";
import { EstimatePlayerUseCase } from "./estimate-player";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";
import * as Round from "@/domains/round";
import { createMockedRoundRepository, randomRound } from "@/test-lib";
import * as UserEstimation from "@/domains/user-estimation";

const CARDS = SelectableCards.create([StoryPoint.create(1)]);

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    roundId: Round.createId(),
    userEstimation: UserEstimation.estimated(CARDS[0]),
  };

  const repository = createMockedRoundRepository();

  const useCase = new EstimatePlayerUseCase(repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret).toEqual({ kind: "notFound" });
});

test("should save player with card selected by user", async () => {
  // Arrange
  const round = randomRound({ cards: CARDS });
  const owner = User.createId();
  const input = {
    userId: owner,
    roundId: round.id,
    userEstimation: UserEstimation.estimated(CARDS[0]),
  };

  const save = sinon.fake();
  const repository = createMockedRoundRepository({
    save,
    findBy: sinon.fake.resolves(round),
  });

  // Act
  const useCase = new EstimatePlayerUseCase(repository);
  const ret = await useCase.execute(input);

  // Assert
  expect(ret).toEqual({ kind: "success", round: save.lastCall.firstArg });
  expect(save.callCount).toBe(1);
  expect(save.lastCall.firstArg.estimations).toEqual(
    Object.fromEntries([[input.userId, UserEstimation.estimated(CARDS[0])]])
  );
});
