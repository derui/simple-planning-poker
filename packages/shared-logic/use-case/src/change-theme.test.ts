import { test, expect } from "vitest";
import { newChangeThemeUseCase } from "./change-theme.js";
import { Voting, User, UserEstimation, ApplicablePoints, StoryPoint, Estimations, Voter } from "@spp/shared-domain";
import { newMemoryVotingRepository } from "@spp/shared-domain/mock/voting-repository";
import { enableMapSet } from "immer";

enableMapSet();

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    votingId: Voting.createId(),
    theme: "foo",
  };
  const repository = newMemoryVotingRepository();
  const useCase = newChangeThemeUseCase(repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toBe("notFound");
});

test("should be able to change theme", async () => {
  // Arrange
  const id = Voting.createId();
  const input = {
    votingId: id,
    theme: "name",
  };
  const voting = Voting.votingOf({
    id,
    points: ApplicablePoints.create([StoryPoint.create(1)]),
    estimations: Estimations.create([User.createId("user")]),
    theme: "not changed",
    voters: [Voter.createVoter({ user: User.createId("user") })],
  });

  const repository = newMemoryVotingRepository([voting]);
  const useCase = newChangeThemeUseCase(repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toBe("success");

  const saved = await repository.findBy(id);
  expect(saved!.theme).toBe("name");
});

test("can not change theme when voting is revealed", async () => {
  // Arrange
  const id = Voting.createId();
  const input = {
    votingId: id,
    theme: "name",
  };
  let voting = Voting.votingOf({
    id,
    points: ApplicablePoints.create([StoryPoint.create(1)]),
    estimations: Estimations.create([User.createId("id")]),
    theme: "not changed",
    voters: [Voter.createVoter({ user: User.createId("id") })],
  });
  voting = Voting.takePlayerEstimation(voting, User.createId("id"), UserEstimation.submittedOf(voting.points[0]));
  voting = Voting.reveal(voting)[0];
  const repository = newMemoryVotingRepository([voting]);
  const useCase = newChangeThemeUseCase(repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toBe("canNotChangeTheme");
});
