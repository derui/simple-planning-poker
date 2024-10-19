import type { Meta, StoryObj } from "@storybook/react";

import { hooks, Hooks, ImplementationProvider } from "../../hooks/facade.js";
import { newMemoryVotingRepository } from "@spp/shared-domain/mock/voting-repository";
import { newMemoryUserRepository } from "@spp/shared-domain/mock/user-repository";
import { createStore, Provider } from "jotai";
import {
  createUseJoin,
  createUsePollingPlace,
  createUseRevealed,
  createUseVoting,
  createUseVotingStatus,
} from "../../atoms/voting.js";
import { ApplicablePoints, Estimations, StoryPoint, User, Voter, Voting } from "@spp/shared-domain";
import {
  newChangeThemeUseCase,
  newChangeUserModeUseCase,
  newEstimatePlayerUseCase,
  newResetVotingUseCase,
  newRevealUseCase,
} from "@spp/shared-use-case";
import sinon from "sinon";
import { VotingArea } from "./voting-area.js";
import { useEffect } from "react";
import { enableMapSet } from "immer";

enableMapSet();

const meta = {
  title: "Containers/Voting Area",
  component: VotingArea,
  tags: ["autodocs"],
} satisfies Meta<typeof VotingArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    votingId: Voting.createId(),
  },
  render({ votingId }: { votingId: Voting.Id }) {
    const store = createStore();
    const userId = User.createId("id");
    const votingRepository = newMemoryVotingRepository([
      Voting.votingOf({
        id: votingId,
        points: ApplicablePoints.create([StoryPoint.create(1), StoryPoint.create(2)]),
        estimations: Estimations.empty(),
        voters: [Voter.createVoter({ user: userId })],
      }),
    ]);
    const userRepository = newMemoryUserRepository([User.create({ id: userId, name: "player1" })]);
    const useLoginUser = () => {
      return {
        userId: userId,
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
          <VotingArea />
        </Provider>
      </ImplementationProvider>
    );
  },
};
