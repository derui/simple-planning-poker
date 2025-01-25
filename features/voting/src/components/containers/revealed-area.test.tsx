import { ApplicablePoints, Estimations, StoryPoint, User, Voter, VoterType, Voting } from "@spp/shared-domain";
import { clear as clearUser } from "@spp/shared-domain/mock/user-repository";
import { clear as clearVoting } from "@spp/shared-domain/mock/voting-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { cleanup, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { afterEach, beforeEach, expect, test } from "vitest";
import { joinVotingAtom } from "../../atoms/voting-atom.js";
import { RevealedArea } from "./revealed-area.js";

beforeEach(clearUser);
beforeEach(clearVoting);
afterEach(cleanup);

test("Pass valid states to child component", async () => {
  // Arrange
  const store = createStore();

  const userId = User.createId();
  const otherUserId = User.createId();
  const votingId = Voting.createId();

  await VotingRepository.save({
    voting: Voting.votingOf({
      id: votingId,
      points: ApplicablePoints.create([StoryPoint.create(1), StoryPoint.create(2)]),
      estimations: Estimations.empty(),
      voters: [
        Voter.createVoter({ user: userId }),
        Voter.createVoter({ user: otherUserId, type: VoterType.Inspector }),
      ],
    }),
  });

  await Promise.all(
    [User.create({ id: userId, name: "player1" }), User.create({ id: otherUserId, name: "I'm looking" })].map((user) =>
      UserRepository.save({ user })
    )
  );
  store.set(joinVotingAtom, userId, votingId);

  // Act
  render(
    <Provider store={store}>
      <RevealedArea />
    </Provider>
  );

  // Assert
  expect(await screen.findByText("player1")).not.toBeNull();
  expect(await screen.findByText("I'm looking")).not.toBeNull();
});
