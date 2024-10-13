import { test, expect } from "vitest";
import sinon from "sinon";
import { newRevealUseCase } from "./reveal.js";
import {
  User,
  Voting,
  ApplicablePoints,
  StoryPoint,
  UserEstimation,
  Estimations,
  DomainEvent,
  Voter,
} from "@spp/shared-domain";
import { newMemoryVotingRepository } from "@spp/shared-domain/mock/voting-repository";
import { enableMapSet } from "immer";

enableMapSet();

const POINTS = ApplicablePoints.create([StoryPoint.create(1)]);

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    votingId: Voting.createId(),
  };
  const repository = newMemoryVotingRepository();
  const dispatcher = sinon.fake();

  const useCase = newRevealUseCase(dispatcher, repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret).toEqual({ kind: "notFoundVoting" });
});

test("should save game showed down", async () => {
  // Arrange
  const owner = User.createId();
  const voting = Voting.votingOf({
    id: Voting.createId(),
    estimations: Estimations.create([owner]),
    points: POINTS,
    voters: [Voter.createVoter({ user: owner })],
  });

  const changed = Voting.takePlayerEstimation(voting, owner, UserEstimation.giveUpOf());

  const input = {
    votingId: voting.id,
  };
  const repository = newMemoryVotingRepository([changed]);
  const dispatcher = sinon.fake();

  const useCase = newRevealUseCase(dispatcher, repository);

  // Act
  const ret = await useCase(input);

  // Assert
  const saved = await repository.findBy(voting.id);
  expect(ret).toEqual({ kind: "success", voting: saved });
});

test("should return error if the round can not show down", async () => {
  // Arrange
  const owner = User.createId();
  const voting = Voting.votingOf({
    id: Voting.createId(),
    estimations: Estimations.create([owner]),
    points: POINTS,
    voters: [Voter.createVoter({ user: owner })],
  });

  const input = {
    votingId: voting.id,
  };
  const repository = newMemoryVotingRepository([voting]);
  const dispatcher = sinon.fake();

  const useCase = newRevealUseCase(dispatcher, repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret).toEqual({ kind: "revealed" });
});

test("should dispatch Revealed event", async () => {
  // Arrange
  const owner = User.createId();
  const voting = Voting.votingOf({
    id: Voting.createId(),
    estimations: Estimations.create([owner]),
    points: POINTS,
    voters: [Voter.createVoter({ user: owner })],
  });
  const changed = Voting.takePlayerEstimation(voting, owner, UserEstimation.submittedOf(POINTS[0]));
  const input = {
    votingId: voting.id,
  };
  const repository = newMemoryVotingRepository([changed]);
  const dispatcher = sinon.fake<DomainEvent.T[]>();

  const useCase = newRevealUseCase(dispatcher, repository);

  // Act
  await useCase(input);

  // Assert
  expect(dispatcher.callCount).toBe(1);
  expect(dispatcher.lastCall.args[0].kind).toBe(DomainEvent.DOMAIN_EVENTS.VotingRevealed);
});
