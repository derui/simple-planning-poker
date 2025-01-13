import type { Meta, StoryObj } from "@storybook/react";

import { ApplicablePoints, Estimations, StoryPoint, User, Voter, VoterType, Voting } from "@spp/shared-domain";

import { clear as clearUser } from "@spp/shared-domain/mock/user-repository";
import { clear as clearVoting } from "@spp/shared-domain/mock/voting-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { themeClass } from "@spp/ui-theme";
import { enableMapSet } from "immer";
import { createStore, Provider } from "jotai";
import { joinVotingAtom } from "../../atoms/voting-atom.js";
import { VotingArea } from "./voting-area.js";

enableMapSet();

let store = createStore();

const meta: Meta<{ votingId: Voting.Id }> = {
  title: "Containers/Voting Area",
  component: VotingArea,
  tags: ["autodocs"],
  beforeEach: async () => {
    clearVoting();
    clearUser();

    store = createStore();

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
      [User.create({ id: userId, name: "player1" }), User.create({ id: otherUserId, name: "I'm looking" })].map(
        (user) => UserRepository.save({ user })
      )
    );

    store.set(joinVotingAtom, userId, votingId);
  },
};

export default meta;
type Story = StoryObj<{ votingId: Voting.Id }>;

export const Default: Story = {
  render() {
    return (
      <Provider store={store}>
        <div className={themeClass}>
          <VotingArea />
        </div>
      </Provider>
    );
  },
};
