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
  Voter,
} from "@spp/shared-domain";
import { newMemoryVotingRepository } from "@spp/shared-domain/mock/voting-repository";
import { newResetVotingUseCase } from "./reset-voting.js";

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    votingId: Voting.createId(),
  };

  const votingRepository = newMemoryVotingRepository();
  const dispatcher = sinon.fake();

  const useCase = newResetVotingUseCase(dispatcher, votingRepository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toEqual("notFound");
});

test("should save reseted voting", async () => {
  // Arrange
  const points = ApplicablePoints.create([StoryPoint.create(1)]);
  const voter = Voter.createVoter({ user: User.createId("id"), type: Voter.VoterType.Normal });
  const voting = Voting.votingOf({
    id: Voting.createId("id"),
    points,
    estimations: Estimations.from({
      [voter.user]: UserEstimation.giveUpOf(),
    }),
    voters: [voter],
  });

  const input = {
    votingId: voting.id,
  };
  const votingRepository = newMemoryVotingRepository([voting]);
  const dispatcher = sinon.fake();

  const useCase = newResetVotingUseCase(dispatcher, votingRepository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toEqual("success");
});

test("should dispatch VotingStarted event", async () => {
  // Arrange
  const points = ApplicablePoints.create([StoryPoint.create(1)]);
  const voter = Voter.createVoter({ user: User.createId("id"), type: Voter.VoterType.Normal });
  const voting = Voting.votingOf({
    id: Voting.createId(),
    points,
    estimations: Estimations.from({
      [voter.user]: UserEstimation.giveUpOf(),
    }),
    voters: [voter],
  });

  const input = {
    votingId: voting.id,
  };
  const votingRepository = newMemoryVotingRepository([voting]);
  const dispatcher = sinon.fake<DomainEvent.T[]>();

  const useCase = newResetVotingUseCase(dispatcher, votingRepository);

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
