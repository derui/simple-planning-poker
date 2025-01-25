import {
  ApplicablePoints,
  DomainEvent,
  Estimations,
  StoryPoint,
  User,
  Voter,
  VoterType,
  Voting,
} from "@spp/shared-domain";
import { clear } from "@spp/shared-domain/mock/voting-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import sinon from "sinon";
import { beforeEach, expect, test } from "vitest";
import { ChangeUserModeUseCase } from "./change-user-mode.js";
import { clearSubsctiptions, subscribe } from "./event-dispatcher.js";

beforeEach(() => {
  clear();
  clearSubsctiptions();
});

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    votingId: Voting.createId(),
    voterType: VoterType.Inspector,
  };

  // Act
  const ret = await ChangeUserModeUseCase(input);

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
    voterType: VoterType.Inspector,
  };

  await VotingRepository.save({ voting });

  // Act
  const ret = await ChangeUserModeUseCase(input);

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
    voters: [Voter.createVoter({ user, type: VoterType.Inspector })],
  });
  const input = {
    userId: user,
    votingId: voting.id,
    voterType: VoterType.Normal,
  };

  const fake = sinon.fake<[DomainEvent.T]>();
  await VotingRepository.save({ voting });
  subscribe(fake);

  // Act
  const ret = await ChangeUserModeUseCase(input);

  // Assert
  expect(ret.kind).toBe("success");
  const saved = await VotingRepository.findBy({ id: input.votingId });
  expect(saved?.participatedVoters?.find((v) => v.user == user)?.type).toBe(VoterType.Normal);
  expect(fake.calledOnce).toBeTruthy();

  const event = fake.lastCall.args[0];
  expect(Voting.isVoterChanged(event)).toBeTruthy();
});
