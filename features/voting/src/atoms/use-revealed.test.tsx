import { ApplicablePoints, Estimations, StoryPoint, User, UserEstimation, Voter, Voting } from "@spp/shared-domain";
import { clear as clearUser } from "@spp/shared-domain/mock/user-repository";
import { clear as clearVoting } from "@spp/shared-domain/mock/voting-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { act, renderHook, waitFor } from "@testing-library/react";
import { enableMapSet } from "immer";
import { createStore, Provider } from "jotai";
import { beforeEach, describe, expect, test } from "vitest";
import { useRevealed } from "./use-revealed.js";
import { joinVotingAtom } from "./voting-atom.js";

enableMapSet();

beforeEach(clearUser);
beforeEach(clearVoting);

/* eslint-disable  @typescript-eslint/require-await */

const createWrapper =
  (store?: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

describe("UseRevealed", () => {
  const POINTS = ApplicablePoints.create([StoryPoint.create(1)]);
  describe("ChangeTheme", () => {
    test("update theme of the current joining voting", async () => {
      // Arrange
      const userId = User.createId();
      const votingId = Voting.createId();
      const voting = Voting.revealedOf({
        id: votingId,
        points: POINTS,
        theme: "foo",
        estimations: Estimations.from({
          [userId]: UserEstimation.submittedOf(POINTS[1]),
        }),
        voters: [Voter.createVoter({ user: userId })],
      });
      await VotingRepository.save({ voting });
      await UserRepository.save({ user: User.create({ id: userId, name: "foo" }) });

      const store = createStore();
      store.set(joinVotingAtom, userId, votingId);
      const wrapper = createWrapper(store);

      // Act
      const { result } = renderHook(useRevealed, { wrapper });

      await waitFor(async () => result.current.loading == false);
      await act(async () => result.current.changeTheme("new theme"));

      // Assert
      const actual = await VotingRepository.findBy({ id: votingId });
      expect(actual?.theme).toBe("new theme");
    });
  });

  test("reset revealed voting", async () => {
    // Arrange
    const userId = User.createId();
    const votingId = Voting.createId();
    const voting = Voting.revealedOf({
      id: votingId,
      points: POINTS,
      theme: "foo",
      estimations: Estimations.from({
        [userId]: UserEstimation.submittedOf(POINTS[1]),
      }),
      voters: [Voter.createVoter({ user: userId })],
    });
    await VotingRepository.save({ voting });
    await UserRepository.save({ user: User.create({ id: userId, name: "foo" }) });

    const store = createStore();
    store.set(joinVotingAtom, userId, votingId);
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(useRevealed, { wrapper });

    await waitFor(async () => result.current.loading == false);
    await act(async () => result.current.reset());

    // Assert
    const actual = await VotingRepository.findBy({ id: votingId });
    expect(actual?.status).toBe(Voting.VotingStatus.Voting);
  });

  test("averageEstimation should be 0 when loading", async () => {
    // Arrange
    const userId = User.createId();
    const votingId = Voting.createId();
    const voting = Voting.revealedOf({
      id: votingId,
      points: POINTS,
      theme: "foo",
      estimations: Estimations.from({
        [userId]: UserEstimation.submittedOf(POINTS[1]),
      }),
      voters: [Voter.createVoter({ user: userId })],
    });
    await VotingRepository.save({ voting });
    await UserRepository.save({ user: User.create({ id: userId, name: "foo" }) });

    const store = createStore();
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(useRevealed, { wrapper });

    // Assert
    expect(result.current.averageEstimation).toBe(0);
  });

  test("averageEstimation should be correct after loaded with 1 estimation", async () => {
    // Arrange
    const userId = User.createId();
    const votingId = Voting.createId();
    const voting = Voting.revealedOf({
      id: votingId,
      points: POINTS,
      theme: "foo",
      estimations: Estimations.from({
        [userId]: UserEstimation.submittedOf(POINTS[0]),
      }),
      voters: [Voter.createVoter({ user: userId })],
    });
    await VotingRepository.save({ voting });
    await UserRepository.save({ user: User.create({ id: userId, name: "foo" }) });

    const store = createStore();
    store.set(joinVotingAtom, userId, votingId);
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(useRevealed, { wrapper });

    await waitFor(async () => result.current.loading == false);

    // Assert
    expect(result.current.averageEstimation).toBe(1);
  });

  test("averageEstimation should be correct after loaded with 3 estimation", async () => {
    // Arrange
    const userIds = [User.createId("1"), User.createId("2"), User.createId("3")];
    const points = ApplicablePoints.parse("1,2,3,4")!;
    const votingId = Voting.createId();
    const voting = Voting.revealedOf({
      id: votingId,
      points: points,
      theme: "foo",
      estimations: Estimations.from({
        [userIds[0]]: UserEstimation.submittedOf(points[0]),
        [userIds[1]]: UserEstimation.submittedOf(points[2]),
        [userIds[2]]: UserEstimation.submittedOf(points[3]),
      }),
      voters: userIds.map((user) => Voter.createVoter({ user })),
    });
    await VotingRepository.save({ voting });
    await UserRepository.save({ user: User.create({ id: userIds[0], name: "foo0" }) });
    await UserRepository.save({ user: User.create({ id: userIds[1], name: "foo1" }) });
    await UserRepository.save({ user: User.create({ id: userIds[2], name: "foo2" }) });

    const store = createStore();
    store.set(joinVotingAtom, userIds[0], votingId);
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(useRevealed, { wrapper });

    await waitFor(async () => result.current.loading == false);

    // Assert
    expect(result.current.averageEstimation).toBe(2.7);
  });
});
