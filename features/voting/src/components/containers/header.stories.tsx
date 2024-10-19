import type { Meta, StoryObj } from "@storybook/react";

import { Header } from "./header.js";
import { Hooks, ImplementationProvider } from "../../hooks/facade.js";
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

const meta = {
  title: "Containers/Header",
  component: Header,
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render() {
    const store = createStore();
    const userId = User.createId("id");
    const votingRepository = newMemoryVotingRepository([
      Voting.votingOf({
        id: Voting.createId(),
        points: ApplicablePoints.create([StoryPoint.create(1)]),
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

    return (
      <ImplementationProvider implementation={hooks}>
        <Provider store={store}>
          <Header />
        </Provider>
      </ImplementationProvider>
    );
  },
};
