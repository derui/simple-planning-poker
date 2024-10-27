import { ApplicablePoints, Estimations, StoryPoint, User, UserEstimation, Voter, Voting } from "@spp/shared-domain";
import { newMemoryUserRepository } from "@spp/shared-domain/mock/user-repository";
import { newMemoryVotingRepository } from "@spp/shared-domain/mock/voting-repository";
import { enableMapSet } from "immer";
import sinon from "sinon";
import { expect, test } from "vitest";
import { newJoinVotingUseCase } from "./join-voting.js";

enableMapSet();

const POINTS = ApplicablePoints.create([StoryPoint.create(1)]);

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    votingId: Voting.createId(),
  };

  const repository = newMemoryVotingRepository();
  const userRepository = newMemoryUserRepository();

  const useCase = newJoinVotingUseCase(repository, userRepository, sinon.fake());

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret).toEqual({ kind: "notFound" });
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

  const repository = newMemoryVotingRepository([voting]);
  const userRepository = newMemoryUserRepository();

  const useCase = newJoinVotingUseCase(repository, userRepository, sinon.fake());

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret).toEqual({ kind: "userNotFound" });
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

  const repository = newMemoryVotingRepository([voting]);
  const userRepository = newMemoryUserRepository([
    User.create({ id: owner, name: owner }),
    User.create({ id: other, name: other }),
  ]);

  // Act
  const useCase = newJoinVotingUseCase(repository, userRepository, sinon.fake());
  const ret = await useCase(input);

  // Assert
  const saved = await repository.findBy(voting.id);

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

  const repository = newMemoryVotingRepository([voting]);
  const userRepository = newMemoryUserRepository([
    User.create({ id: owner, name: owner }),
    User.create({ id: other, name: other }),
  ]);

  // Act
  const useCase = newJoinVotingUseCase(repository, userRepository, sinon.fake());
  const ret = await useCase(input);

  // Assert
  const saved = await repository.findBy(voting.id);

  expect(ret).toEqual({ kind: "success", voting: saved! });
  expect(saved?.participatedVoters).toEqual([Voter.createVoter({ user: owner })]);
});
