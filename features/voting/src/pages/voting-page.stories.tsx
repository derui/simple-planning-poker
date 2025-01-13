import type { Meta, StoryObj } from "@storybook/react";

import { ApplicablePoints, Estimations, StoryPoint, User, Voter, VoterType, Voting } from "@spp/shared-domain";
import { clear as clearGame } from "@spp/shared-domain/mock/game-repository";
import { clear as clearUser } from "@spp/shared-domain/mock/user-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { themeClass } from "@spp/ui-theme";
import { Provider } from "jotai";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { VotingPage } from "./voting-page.js";

const meta: Meta<typeof VotingPage> = {
  title: "Page/Voting",
  component: VotingPage,
  tags: ["autodocs"],
  beforeEach: async () => {
    clearGame();
    clearUser();

    const userId = User.createId("user");
    const otherUserId = User.createId();
    const votingId = Voting.createId("voting");

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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render() {
    const { hook } = memoryLocation();

    return (
      <Router hook={hook}>
        <Provider>
          <div className={themeClass}>
            <VotingPage currentUserId="user" votingId="voting" />
          </div>
        </Provider>
      </Router>
    );
  },
};
