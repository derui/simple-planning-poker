import { ApplicablePoints, Estimations, StoryPoint, User, UserEstimation, Voter, Voting } from "@spp/shared-domain";
import { clear as clearUser } from "@spp/shared-domain/mock/user-repository";
import { clear as clearVoting } from "@spp/shared-domain/mock/voting-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { enableMapSet } from "immer";
import { beforeEach, expect, test } from "vitest";
import { clearSubsctiptions } from "./event-dispatcher.js";
import { JoinVotingUseCase } from "./join-voting.js";

enableMapSet();

beforeEach(() => {
  clearUser();
  clearVoting();
  clearSubsctiptions();
});

const POINTS = ApplicablePoints.create([StoryPoint.create(1)]);

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    votingId: Voting.createId(),
  };

  // Act
  const ret = await JoinVotingUseCase(input);

  // Assert
  expect(ret).toEqual({ kind: "error", detail: "notFound" });
});

test("should return error if user not found", async () => {
  // Arrange
  const owner = User.createId();
  const voting = Voting.votingOf({
    id: Voting.createId(),
    points: POINTS,
    estimations: Estimations.empty(),
    voters: [Voter.createVoter({ user: owner })],
  });
  const input = {
    userId: User.createId(),
    votingId: voting.id,
  };

  await VotingRepository.save({ voting });

  // Act
  const ret = await JoinVotingUseCase(input);

  // Assert
  expect(ret).toEqual({ kind: "error", detail: "userNotFound" });
});

test("join user to the voting", async () => {
  // Arrange
  const owner = User.createId();
  const other = User.createId();
  const voting = Voting.votingOf({
    id: Voting.createId(),
    points: POINTS,
    estimations: Estimations.empty(),
    voters: [Voter.createVoter({ user: owner })],
  });

  const input = {
    userId: other,
    votingId: voting.id,
    userEstimation: UserEstimation.submittedOf(POINTS[0]),
  };

  await VotingRepository.save({ voting });
  await UserRepository.save({ user: User.create({ id: owner, name: owner }) });
  await UserRepository.save({ user: User.create({ id: other, name: other }) });

  // Act
  const ret = await JoinVotingUseCase(input);

  // Assert
  const saved = await VotingRepository.findBy({ id: voting.id });

  expect(ret).toEqual({ kind: "success", voting: saved! });
  expect(saved?.participatedVoters).toEqual([
    Voter.createVoter({ user: owner }),
    Voter.createVoter({ user: input.userId }),
  ]);
});

test("do not join user twice", async () => {
  // Arrange
  const owner = User.createId();
  const other = User.createId();
  const voting = Voting.votingOf({
    id: Voting.createId(),
    points: POINTS,
    estimations: Estimations.empty(),
    voters: [Voter.createVoter({ user: owner })],
  });

  const input = {
    userId: owner,
    votingId: voting.id,
    userEstimation: UserEstimation.submittedOf(POINTS[0]),
  };

  await VotingRepository.save({ voting });
  await UserRepository.save({ user: User.create({ id: owner, name: owner }) });
  await UserRepository.save({ user: User.create({ id: other, name: other }) });

  // Act
  const ret = await JoinVotingUseCase(input);

  // Assert
  const saved = await VotingRepository.findBy({ id: voting.id });

  expect(ret).toEqual({ kind: "success", voting: saved! });
  expect(saved?.participatedVoters).toEqual([Voter.createVoter({ user: owner })]);
});
