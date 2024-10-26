import type { Meta, StoryObj } from "@storybook/react";

import { ApplicablePoints, Estimations, StoryPoint, User, Voter, Voting } from "@spp/shared-domain";
import { newMemoryUserRepository } from "@spp/shared-domain/mock/user-repository";
import { newMemoryVotingRepository } from "@spp/shared-domain/mock/voting-repository";
import {
  newChangeThemeUseCase,
  newChangeUserModeUseCase,
  newEstimatePlayerUseCase,
  newResetVotingUseCase,
  newRevealUseCase,
} from "@spp/shared-use-case";
import { themeClass } from "@spp/ui-theme";
import { enableMapSet } from "immer";
import { createStore, Provider } from "jotai";
import { useEffect } from "react";
import sinon from "sinon";
import {
  createUseJoin,
  createUsePollingPlace,
  createUseRevealed,
  createUseVoting,
  createUseVotingStatus,
} from "../../atoms/voting.js";
import { Hooks, ImplementationProvider } from "../../hooks/facade.js";
import { RevealedArea } from "./revealed-area.js";

enableMapSet();

const meta = {
  title: "Containers/Revealed Area",
  tags: ["autodocs"],
} satisfies Meta<{ votingId: Voting.Id }>;

export default meta;
type Story = StoryObj<{ votingId: Voting.Id }>;

export const Default: Story = {
  args: {
    votingId: Voting.createId(),
  },
  render({ votingId }: { votingId: Voting.Id }) {
    const store = createStore();
    const users = {
      player: User.createId(),
      inspector: User.createId(),
    };
    const votingRepository = newMemoryVotingRepository([
      Voting.votingOf({
        id: votingId,
        points: ApplicablePoints.create([StoryPoint.create(1), StoryPoint.create(2)]),
        estimations: Estimations.empty(),
        voters: [
          Voter.createVoter({ user: users.player }),
          Voter.createVoter({ user: users.inspector, type: Voter.VoterType.Inspector }),
        ],
      }),
    ]);
    const userRepository = newMemoryUserRepository([
      User.create({ id: users.player, name: "player1" }),
      User.create({ id: users.inspector, name: "I'm looking" }),
    ]);
    const useLoginUser = () => {
      return {
        userId: users.player,
      };
    };
    const hooks: Hooks = {
      useJoin: createUseJoin(useLoginUser, votingRepository, userRepository),
      useVoting: createUseVoting({
        useLoginUser,
        changeThemeUseCase: newChangeThemeUseCase(votingRepository),
        estimatePlayerUseCase: newEstimatePlayerUseCase(votingRepository),
        changeUserModeUseCase: newChangeUserModeUseCase(votingRepository, sinon.fake()),
        revealUseCase: newRevealUseCase(sinon.fake(), votingRepository),
      }),
      useRevealed: createUseRevealed({
        changeThemeUseCase: newChangeThemeUseCase(votingRepository),
        resetVotingUseCase: newResetVotingUseCase(sinon.fake(), votingRepository),
      }),

      usePollingPlace: createUsePollingPlace(),
      useVotingStatus: createUseVotingStatus(),
    };

    useEffect(() => {
      hooks.useJoin().join(votingId);
    }, []);

    return (
      <ImplementationProvider implementation={hooks}>
        <Provider store={store}>
          <div className={themeClass}>
            <RevealedArea />
          </div>
        </Provider>
      </ImplementationProvider>
    );
  },
};
