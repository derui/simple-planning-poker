import { ApplicablePoints, Estimations, StoryPoint, User, UserEstimation, Voter, Voting } from "@spp/shared-domain";
import { clear } from "@spp/shared-domain/mock/voting-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { enableMapSet } from "immer";
import { beforeEach, expect, test } from "vitest";
import { ChangeThemeUseCase } from "./change-theme.js";

enableMapSet();

beforeEach(() => {
  clear();
});

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    votingId: Voting.createId(),
    theme: "foo",
  };

  // Act
  const ret = await ChangeThemeUseCase(input);

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
    estimations: Estimations.empty(),
    theme: "not changed",
    voters: [Voter.createVoter({ user: User.createId("user") })],
  });
  await VotingRepository.save({ voting });

  // Act
  const ret = await ChangeThemeUseCase(input);

  // Assert
  expect(ret.kind).toBe("success");

  const saved = await VotingRepository.findBy({ id });
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
    estimations: Estimations.empty(),
    theme: "not changed",
    voters: [Voter.createVoter({ user: User.createId("id") })],
  });
  voting = Voting.takePlayerEstimation(voting, User.createId("id"), UserEstimation.submittedOf(voting.points[0]));
  voting = Voting.reveal(voting)[0];
  await VotingRepository.save({ voting });

  // Act
  const ret = await ChangeThemeUseCase(input);

  // Assert
  expect(ret.kind).toBe("canNotChangeTheme");
});
