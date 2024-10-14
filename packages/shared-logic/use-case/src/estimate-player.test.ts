import { test, expect } from "vitest";
import { newEstimatePlayerUseCase } from "./estimate-player.js";
import { ApplicablePoints, StoryPoint, User, Voting, UserEstimation, Estimations, Voter } from "@spp/shared-domain";
import { newMemoryVotingRepository } from "@spp/shared-domain/mock/voting-repository";
import { enableMapSet } from "immer";

enableMapSet();

const POINTS = ApplicablePoints.create([StoryPoint.create(1)]);

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    votingId: Voting.createId(),
    userEstimation: UserEstimation.submittedOf(POINTS[0]),
  };

  const repository = newMemoryVotingRepository();

  const useCase = newEstimatePlayerUseCase(repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret).toEqual({ kind: "notFound" });
});

test("should save player with card selected by user", async () => {
  // Arrange
  const owner = User.createId();
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

  // Act
  const useCase = newEstimatePlayerUseCase(repository);
  const ret = await useCase(input);

  // Assert
  const saved = await repository.findBy(voting.id);

  expect(ret).toEqual({ kind: "success", voting: saved! });
  expect(saved?.estimations).toEqual(
    Estimations.from({
      [owner]: UserEstimation.submittedOf(POINTS[0]),
    })
  );
});
