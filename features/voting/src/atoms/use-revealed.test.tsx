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
});
