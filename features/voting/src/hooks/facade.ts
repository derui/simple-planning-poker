import { createFacade } from "@spp/shared-hook-facade";
import { UseJoin, UsePollingPlace, UseRevealed, UseVoting, UseVotingStatus } from "../atoms/voting.js";

export type Hooks = {
  useJoin: UseJoin;
  useVoting: UseVoting;
  useRevealed: UseRevealed;
  useVotingStatus: UseVotingStatus;
  usePollingPlace: UsePollingPlace;
};

const facade: ReturnType<typeof createFacade<Hooks>> = createFacade<Hooks>();

export const hooks: Readonly<Hooks> = facade.hooks;
export const ImplementationProvider: typeof facade.ImplementationProvider = facade.ImplementationProvider;
