import { ApplicablePoints, Estimations, StoryPoint, User, Voter, Voting } from "@spp/shared-domain";
import { clear as clearUser } from "@spp/shared-domain/mock/user-repository";
import { clear as clearVoting } from "@spp/shared-domain/mock/voting-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { renderHook, waitFor } from "@testing-library/react";
import { enableMapSet } from "immer";
import { createStore, Provider } from "jotai";
import { act } from "react";
import { beforeEach, describe, expect, test } from "vitest";
import { useVoter } from "./use-voter.js";
import { joinVotingAtom } from "./voting-atom.js";

enableMapSet();

/* eslint-disable  @typescript-eslint/require-await */

const createWrapper =
  (store?: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

beforeEach(clearUser);
beforeEach(clearVoting);

describe("useVoter", () => {
  const POINTS = ApplicablePoints.create([StoryPoint.create(1), StoryPoint.create(5)]);

  test("should return undefined role if no user or voting is set", () => {
    // Arrange

    // Act
    const { result } = renderHook(() => useVoter(), { wrapper: createWrapper() });

    // Assert
    expect(result.current.role).toBeUndefined();
  });

  test("should return the correct role and isInspector based on current voter's role", async () => {
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
    const { result } = renderHook(() => useVoter(), { wrapper });
    await waitFor(async () => result.current.role !== undefined);

    // Assert
    expect(result.current.role).toBe("player");
  });

  test("should be able to toggle role of current user", async () => {
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
    const { result } = renderHook(() => useVoter(), { wrapper });
    await waitFor(async () => result.current.role !== undefined);
    await act(async () => result.current.toggleRole());

    // Assert
    expect(result.current.role).toBe("inspector");
  });
});
