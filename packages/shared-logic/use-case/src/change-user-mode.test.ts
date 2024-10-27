import { ApplicablePoints, DomainEvent, Estimations, StoryPoint, User, Voter, Voting } from "@spp/shared-domain";
import { newMemoryVotingRepository } from "@spp/shared-domain/mock/voting-repository";
import sinon from "sinon";
import { expect, test } from "vitest";
import { newChangeUserModeUseCase } from "./change-user-mode.js";

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    votingId: Voting.createId(),
    voterType: Voter.VoterType.Inspector,
  };

  const repository = newMemoryVotingRepository();
  const useCase = newChangeUserModeUseCase(repository, sinon.fake());

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toBe("notFound");
});

test("should return error if voter not found", async () => {
  // Arrange
  const user = User.createId();
  const voting = Voting.votingOf({
    id: Voting.createId(),
    points: ApplicablePoints.create([StoryPoint.create(1)]),
    estimations: Estimations.empty(),
    voters: [Voter.createVoter({ user })],
  });
  const input = {
    userId: User.createId("changed"),
    votingId: voting.id,
    voterType: Voter.VoterType.Inspector,
  };

  const repository = newMemoryVotingRepository([voting]);
  const useCase = newChangeUserModeUseCase(repository, sinon.fake());

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toBe("notFound");
});

test("should save voting", async () => {
  // Arrange
  const user = User.createId();
  const voting = Voting.votingOf({
    id: Voting.createId(),
    points: ApplicablePoints.create([StoryPoint.create(1)]),
    estimations: Estimations.empty(),
    voters: [Voter.createVoter({ user, type: Voter.VoterType.Inspector })],
  });
  const input = {
    userId: user,
    votingId: voting.id,
    voterType: Voter.VoterType.Normal,
  };

  const repository = newMemoryVotingRepository([voting]);
  const fake = sinon.fake<[DomainEvent.T]>();
  const useCase = newChangeUserModeUseCase(repository, fake);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toBe("success");
  const saved = await repository.findBy(input.votingId);
  expect(saved?.participatedVoters?.find((v) => v.user == user)?.type).toBe(Voter.VoterType.Normal);
  expect(fake.calledOnce).toBeTruthy();

  const event = fake.lastCall.args[0];
  expect(Voting.isVoterChanged(event)).toBeTruthy();
});
