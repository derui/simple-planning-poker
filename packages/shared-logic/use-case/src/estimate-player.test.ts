import { ApplicablePoints, Estimations, StoryPoint, User, UserEstimation, Voter, Voting } from "@spp/shared-domain";
import { clear } from "@spp/shared-domain/mock/voting-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { enableMapSet } from "immer";
import { beforeEach, expect, test } from "vitest";
import { EstimatePlayerUseCase } from "./estimate-player.js";
import { clearSubsctiptions } from "./event-dispatcher.js";

enableMapSet();

beforeEach(() => {
  clear();
  clearSubsctiptions();
});

const POINTS = ApplicablePoints.create([StoryPoint.create(1), StoryPoint.create(5)]);

test("should return error if game is not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    votingId: Voting.createId(),
    userEstimation: UserEstimation.submittedOf(POINTS[0]),
  };

  // Act
  const ret = await EstimatePlayerUseCase(input);

  // Assert
  expect(ret).toEqual({ kind: "error", detail: "notFound" });
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
    userEstimation: UserEstimation.submittedOf(POINTS[1]),
  };

  await VotingRepository.save({ voting });

  // Act
  const ret = await EstimatePlayerUseCase(input);

  // Assert
  const saved = await VotingRepository.findBy({ id: voting.id });

  expect(ret).toEqual({ kind: "success", voting: saved! });
  expect(saved?.estimations).toEqual(
    Estimations.from({
      [owner]: UserEstimation.submittedOf(POINTS[1]),
    })
  );
});
