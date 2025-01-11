import { ApplicablePoints, Estimations, StoryPoint, User, Voter, Voting } from "@spp/shared-domain";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { renderHook, waitFor } from "@testing-library/react";
import { enableMapSet } from "immer";
import { createStore, Provider } from "jotai";
import { expect, test } from "vitest";
import { PollingPlace } from "./type.js";
import { usePollingPlace } from "./use-polling-place.js";
import { joinVotingAtom } from "./voting-atom.js";

enableMapSet();

/* eslint-disable  @typescript-eslint/require-await */

const createWrapper =
  (store?: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

const POINTS = ApplicablePoints.create([StoryPoint.create(1)]);

test("default status", async () => {
  // Arrange
  const wrapper = createWrapper();

  // Act
  const { result } = renderHook(usePollingPlace, { wrapper });

  // Assert
  expect(result.current.loading).toBeTruthy();
  expect(result.current.pollingPlace).toBeUndefined();
});

test("should be able to get polling place after joining", async () => {
  // Arrange
  const votingId = Voting.createId();
  const owner = User.createId();
  const voting = Voting.votingOf({
    id: votingId,
    points: POINTS,
    estimations: Estimations.empty(),
    voters: [Voter.createVoter({ user: owner })],
  });
  const principal = User.createId();

  await VotingRepository.save({ voting });
  const store = createStore();
  store.set(joinVotingAtom, principal, votingId);

  const wrapper = createWrapper(store);

  // Act
  const { result } = renderHook(usePollingPlace, { wrapper });

  await waitFor(async () => result.current.loading == false);

  // Assert
  expect(result.current.loading).toBeFalsy();
  expect(result.current.pollingPlace).toEqual({
    id: votingId,
    estimations: [
      {
        loginUser: false,
        name: "unknown",
      },
      {
        loginUser: true,
        name: "unknown",
      },
    ],
    inspectors: [],
    theme: "",
    points: ["1"],
  } satisfies PollingPlace);
});
