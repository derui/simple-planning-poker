import sinon from "sinon";
import { beforeEach, expect, test } from "vitest";

import {
  ApplicablePoints,
  DomainEvent,
  Estimations,
  StoryPoint,
  User,
  UserEstimation,
  Voter,
  Voting,
} from "@spp/shared-domain";

import { clear } from "@spp/shared-domain/mock/voting-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { enableMapSet } from "immer";
import { clearSubsctiptions, subscribe } from "./event-dispatcher.js";
import { RevealUseCase } from "./reveal.js";

enableMapSet();

beforeEach(() => {
  clear();
  clearSubsctiptions();
});

const POINTS = ApplicablePoints.create([StoryPoint.create(1)]);

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    votingId: Voting.createId(),
  };

  // Act
  const ret = await RevealUseCase(input);

  // Assert
  expect(ret).toEqual({ kind: "error", detail: "notFoundVoting" });
});

test("should save game showed down", async () => {
  // Arrange
  const owner = User.createId();
  const voting = Voting.votingOf({
    id: Voting.createId(),
    estimations: Estimations.empty(),
    points: POINTS,
    voters: [Voter.createVoter({ user: owner })],
  });

  const changed = Voting.takePlayerEstimation(voting, owner, UserEstimation.giveUpOf());

  const input = {
    votingId: voting.id,
  };
  await VotingRepository.save({ voting: changed });

  // Act
  const ret = await RevealUseCase(input);

  // Assert
  const saved = await VotingRepository.findBy({ id: voting.id });
  expect(ret).toEqual({ kind: "success", voting: saved });
});

test("should return error if the round can not show down", async () => {
  // Arrange
  const owner = User.createId();
  const voting = Voting.votingOf({
    id: Voting.createId(),
    estimations: Estimations.empty(),
    points: POINTS,
    voters: [Voter.createVoter({ user: owner })],
  });

  const input = {
    votingId: voting.id,
  };
  await VotingRepository.save({ voting });

  // Act
  const ret = await RevealUseCase(input);

  // Assert
  expect(ret).toEqual({ kind: "error", detail: "failed" });
});

test("should dispatch Revealed event", async () => {
  // Arrange
  const owner = User.createId();
  const voting = Voting.votingOf({
    id: Voting.createId(),
    estimations: Estimations.empty(),
    points: POINTS,
    voters: [Voter.createVoter({ user: owner })],
  });
  const changed = Voting.takePlayerEstimation(voting, owner, UserEstimation.submittedOf(POINTS[0]));
  const input = {
    votingId: voting.id,
  };
  await VotingRepository.save({ voting: changed });
  const dispatcher = sinon.fake<DomainEvent.T[]>();
  subscribe(dispatcher);

  // Act
  await RevealUseCase(input);

  // Assert
  expect(dispatcher.callCount).toBe(1);
  expect(dispatcher.lastCall.args[0].kind).toBe(DomainEvent.DOMAIN_EVENTS.VotingRevealed);
});
