import { ApplicablePoints, Estimations, StoryPoint, User, UserEstimation, Voter, Voting } from "@spp/shared-domain";
import { clear as clearUser } from "@spp/shared-domain/mock/user-repository";
import { clear as clearVoting } from "@spp/shared-domain/mock/voting-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { act, renderHook, waitFor } from "@testing-library/react";
import { enableMapSet } from "immer";
import { createStore, Provider } from "jotai";
import { beforeEach, describe, expect, test } from "vitest";
import { useVoting } from "./use-voting.js";
import { joinVotingAtom } from "./voting-atom.js";

enableMapSet();

/* eslint-disable  @typescript-eslint/require-await */

const createWrapper =
  (store?: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

beforeEach(clearUser);
beforeEach(clearVoting);

describe("UseVoting", () => {
  const POINTS = ApplicablePoints.create([StoryPoint.create(1), StoryPoint.create(5)]);

  test("do not get anything before joining", () => {
    // Arrange

    // Act
    const { result } = renderHook(useVoting, { wrapper: createWrapper() });

    // Assert
    expect(result.current.estimated).toBeUndefined();
    expect(result.current.loading).toBeTruthy();
    expect(result.current.revealable).toBeFalsy();
  });

  test("get voting after joined", async () => {
    // Arrange
    const userId = User.createId();
    const votingId = Voting.createId();
    const voting = Voting.votingOf({
      id: votingId,
      points: POINTS,
      theme: "foo",
      estimations: Estimations.empty(),
      voters: [Voter.createVoter({ user: userId })],
    });
    await VotingRepository.save({ voting });
    await UserRepository.save({ user: User.create({ id: userId, name: "foo" }) });

    const store = createStore();
    store.set(joinVotingAtom, userId, votingId);
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(useVoting, { wrapper });

    await waitFor(async () => result.current.loading == false);

    // Assert
    expect(result.current.estimated).toBeUndefined();
    expect(result.current.revealable).toBeFalsy();
  });

  test("get revealable if the voting is revealable", async () => {
    // Arrange
    const userId = User.createId();
    const votingId = Voting.createId();
    const voting = Voting.votingOf({
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
    const { result } = renderHook(useVoting, { wrapper });

    await waitFor(async () => result.current.loading == false);

    // Assert
    expect(result.current.estimated).toBe("5");
    expect(result.current.revealable).toBeTruthy();
  });

  describe("ChangeTheme", () => {
    test("update theme of the current joining voting", async () => {
      // Arrange
      const userId = User.createId();
      const votingId = Voting.createId();
      const voting = Voting.votingOf({
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
      const { result } = renderHook(useVoting, { wrapper });

      await waitFor(async () => result.current.loading == false);
      await act(async () => result.current.changeTheme("new theme"));

      // Assert
      const actual = await VotingRepository.findBy({ id: votingId });
      expect(actual?.theme).toBe("new theme");
    });
  });

  describe("estimate", () => {
    test("estimated reflect user estimation", async () => {
      // Arrange
      const userId = User.createId();
      const votingId = Voting.createId();
      const voting = Voting.votingOf({
        id: votingId,
        points: POINTS,
        theme: "foo",
        estimations: Estimations.empty(),
        voters: [Voter.createVoter({ user: userId })],
      });
      await VotingRepository.save({ voting });
      await UserRepository.save({ user: User.create({ id: userId, name: "foo" }) });

      const store = createStore();
      store.set(joinVotingAtom, userId, votingId);
      const wrapper = createWrapper(store);

      // Act
      const { result } = renderHook(useVoting, { wrapper });

      await waitFor(async () => result.current.loading == false);
      await act(async () => result.current.estimate(5));

      // Assert
      expect(result.current.estimated).toBe("5");
    });

    test("change esitmation before reveal", async () => {
      // Arrange
      const userId = User.createId();
      const votingId = Voting.createId();
      const voting = Voting.votingOf({
        id: votingId,
        points: POINTS,
        theme: "foo",
        estimations: Estimations.empty(),
        voters: [Voter.createVoter({ user: userId })],
      });
      await VotingRepository.save({ voting });
      await UserRepository.save({ user: User.create({ id: userId, name: "foo" }) });

      const store = createStore();
      store.set(joinVotingAtom, userId, votingId);
      const wrapper = createWrapper(store);

      // Act
      const { result } = renderHook(useVoting, { wrapper });

      await waitFor(async () => result.current.loading == false);
      await act(async () => result.current.estimate(5));
      await act(async () => result.current.estimate(1));

      // Assert
      expect(result.current.estimated).toBe("1");
    });
  });

  describe("reveal", () => {
    test("reveal the voting", async () => {
      // Arrange
      const userId = User.createId();
      const votingId = Voting.createId();
      const voting = Voting.votingOf({
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
      const { result } = renderHook(useVoting, { wrapper });

      await waitFor(async () => result.current.loading == false);
      await waitFor(async () => result.current.reveal());

      // Assert
      expect(result.current.estimated).toBe("5");
      expect(result.current.revealable).toBeFalsy();
    });
  });
});
