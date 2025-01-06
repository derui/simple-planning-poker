import { ApplicablePoints, Estimations, StoryPoint, User, UserEstimation, Voter, Voting } from "@spp/shared-domain";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { act, renderHook } from "@testing-library/react";
import { enableMapSet } from "immer";
import { createStore, Provider } from "jotai";
import { expect, test } from "vitest";
import { JoinedVotingStatus } from "./type.js";
import { useJoin } from "./use-join.js";

enableMapSet();

/* eslint-disable  @typescript-eslint/require-await */

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

const POINTS = ApplicablePoints.create([StoryPoint.create(1)]);

test("default status", async () => {
  // Arrange
  const store = createStore();
  const wrapper = createWrapper(store);

  // Act
  const { result } = renderHook(useJoin, { wrapper });

  // Assert
  expect(result.current.loading).toBeFalsy();
  expect(result.current.status).toBe(JoinedVotingStatus.NotJoined);
});

test("get loading while joining", async () => {
  // Arrange
  const store = createStore();
  const wrapper = createWrapper(store);

  // Act
  const { result, rerender } = renderHook(useJoin, { wrapper });
  result.current.join(User.createId(), Voting.createId());
  rerender();

  // Assert
  expect(result.current.loading).toBe(true);
  expect(result.current.status).toBe(JoinedVotingStatus.NotJoined);
});

test("joined voting as others", async () => {
  // Arrange
  const ownerId = User.createId();
  const userId = User.createId();
  const votingId = Voting.createId();
  const voting = Voting.votingOf({
    id: votingId,
    points: POINTS,
    theme: "foo",
    estimations: Estimations.empty(),
    voters: [Voter.createVoter({ user: ownerId })],
  });

  await VotingRepository.save({ voting });
  await UserRepository.save({ user: User.create({ id: ownerId, name: "owner" }) });
  await UserRepository.save({ user: User.create({ id: userId, name: "user" }) });

  const store = createStore();

  // Act
  const { result } = renderHook(useJoin, { wrapper: createWrapper(store) });
  await act(async () => {
    result.current.join(userId, votingId);
  });

  // Assert
  expect(result.current.loading).toBe(false);
  expect(result.current.status).toBe(JoinedVotingStatus.Voting);
});

test("joined revealed voting as others", async () => {
  // Arrange
  const ownerId = User.createId();
  const userId = User.createId();
  const votingId = Voting.createId();
  let voting = Voting.votingOf({
    id: votingId,
    points: POINTS,
    theme: "foo",
    estimations: Estimations.empty(),
    voters: [Voter.createVoter({ user: ownerId })],
  });
  voting = Voting.takePlayerEstimation(voting, ownerId, UserEstimation.giveUpOf());
  voting = Voting.reveal(voting)[0];

  await VotingRepository.save({ voting });
  await UserRepository.save({ user: User.create({ id: ownerId, name: "owner" }) });
  await UserRepository.save({ user: User.create({ id: userId, name: "user" }) });

  const store = createStore();

  // Act
  const { result } = renderHook(useJoin, { wrapper: createWrapper(store) });
  await act(async () => {
    result.current.join(userId, votingId);
  });

  // Assert
  expect(result.current.loading).toBe(false);
  expect(result.current.status).toBe(JoinedVotingStatus.Revealed);
});
