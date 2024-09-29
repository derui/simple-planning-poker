import { test, expect } from "vitest";
import * as sinon from "sinon";
import {
  Game,
  User,
  Voting,
  StoryPoint,
  ApplicablePoints,
  Estimations,
  UserEstimation,
  DomainEvent,
} from "@spp/shared-domain";
import { newMemoryVotingRepository } from "@spp/shared-domain/mock/voting-repository";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { newResetVotingUseCase } from "./reset-voting.js";

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    gameId: Game.createId(),
  };

  const votingRepository = newMemoryVotingRepository();
  const repository = newMemoryGameRepository();
  const dispatcher = sinon.fake();

  const useCase = newResetVotingUseCase(dispatcher, repository, votingRepository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toEqual("notFound");
});

test("should save reseted voting", async () => {
  // Arrange
  const points = ApplicablePoints.create([StoryPoint.create(1)]);
  const [game] = Game.create({
    id: Game.createId(),
    name: "name",
    owner: User.createId(),
    voting: Voting.createId(),
    points,
  });
  const voting = Voting.votingOf({
    id: game.voting,
    points,
    estimations: Estimations.from({
      [game.owner]: UserEstimation.giveUpOf(),
    }),
  });

  const input = {
    gameId: game.id,
  };
  const votingRepository = newMemoryVotingRepository([voting]);
  const repository = newMemoryGameRepository([game]);
  const dispatcher = sinon.fake();

  const useCase = newResetVotingUseCase(dispatcher, repository, votingRepository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toEqual("success");
});

test("should dispatch VotingStarted event", async () => {
  // Arrange
  const points = ApplicablePoints.create([StoryPoint.create(1)]);
  const [game] = Game.create({
    id: Game.createId(),
    name: "name",
    owner: User.createId(),
    voting: Voting.createId(),
    points,
  });
  const voting = Voting.votingOf({
    id: game.voting,
    points,
    estimations: Estimations.from({
      [game.owner]: UserEstimation.giveUpOf(),
    }),
  });

  const input = {
    gameId: game.id,
  };
  const votingRepository = newMemoryVotingRepository([voting]);
  const repository = newMemoryGameRepository([game]);
  const dispatcher = sinon.fake<DomainEvent.T[]>();

  const useCase = newResetVotingUseCase(dispatcher, repository, votingRepository);

  // Act
  await useCase(input);

  // Assert
  expect(dispatcher.callCount).toBe(1);

  const arg = dispatcher.lastCall.args[0];
  if (Voting.isVotingStarted(arg)) {
    expect(arg.votingId).toEqual(voting.id);
  } else {
    expect.fail("should be VotingStarted event");
  }
});
