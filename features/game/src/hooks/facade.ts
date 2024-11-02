import { createFacade } from "@spp/shared-hook-facade";
import { UseCreateGame, UseListGame, UsePrepareGame } from "../atoms/game.js";

export type Hooks = {
  useCreateGame: UseCreateGame;
  usePrepareGame: UsePrepareGame;
  useListGame: UseListGame;
};

const facade: ReturnType<typeof createFacade<Hooks>> = createFacade<Hooks>();

export const hooks: Readonly<Hooks> = facade.hooks;
export const ImplementationProvider: typeof facade.ImplementationProvider = facade.ImplementationProvider;
