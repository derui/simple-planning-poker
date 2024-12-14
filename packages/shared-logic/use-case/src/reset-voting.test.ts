import {
  ApplicablePoints,
  DomainEvent,
  Estimations,
  StoryPoint,
  User,
  UserEstimation,
  Voter,
  VoterType,
  Voting,
} from "@spp/shared-domain";
import { clear } from "@spp/shared-domain/mock/voting-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import * as sinon from "sinon";
import { beforeEach, expect, test } from "vitest";
import { clearSubsctiptions, subscribe } from "./event-dispatcher.js";
import { ResetVotingUseCase } from "./reset-voting.js";

beforeEach(() => {
  clear();
  clearSubsctiptions();
});

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    votingId: Voting.createId(),
  };

  // Act
  const ret = await ResetVotingUseCase(input);

  // Assert
  expect(ret.kind).toEqual("notFound");
});

test("should save reseted voting", async () => {
  // Arrange
  const points = ApplicablePoints.create([StoryPoint.create(1)]);
  const voter = Voter.createVoter({ user: User.createId("id"), type: VoterType.Normal });
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
  await VotingRepository.save({ voting });

  // Act
  const ret = await ResetVotingUseCase(input);

  // Assert
  expect(ret.kind).toEqual("success");
});

test("should dispatch VotingStarted event", async () => {
  // Arrange
  const points = ApplicablePoints.create([StoryPoint.create(1)]);
  const voter = Voter.createVoter({ user: User.createId("id"), type: VoterType.Normal });
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
  await VotingRepository.save({ voting });
  const dispatcher = sinon.fake<DomainEvent.T[]>();
  subscribe(dispatcher);

  // Act
  await ResetVotingUseCase(input);

  // Assert
  expect(dispatcher.callCount).toBe(1);

  const arg = dispatcher.lastCall.args[0];
  if (Voting.isVotingStarted(arg)) {
    expect(arg.votingId).toEqual(voting.id);
  } else {
    expect.fail("should be VotingStarted event");
  }
});
