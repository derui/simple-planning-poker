import { createFacade } from "@spp/shared-hook-facade";
import { UseJoin, UseVoting, UseRevealed, UseVotingStatus, UsePollingPlace } from "../atoms/voting.js";

export type Hooks = {
  useJoin: UseJoin;
  useVoting: UseVoting;
  useRevealed: UseRevealed;
  useVotingStatus: UseVotingStatus;
  usePollingPlace: UsePollingPlace;
};

const { hooks, ImplementationProvider } = createFacade<Hooks>();

export { hooks, ImplementationProvider };
