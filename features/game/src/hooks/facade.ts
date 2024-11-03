import { createFacade } from "@spp/shared-hook-facade";
import { UseCreateGame } from "../atoms/create-game.js";
import { UseListGames } from "../atoms/list-games.js";

export type Hooks = {
  useCreateGame: UseCreateGame;
  useListGames: UseListGames;
};

const facade: ReturnType<typeof createFacade<Hooks>> = createFacade<Hooks>();

export const hooks: Readonly<Hooks> = facade.hooks;
export const ImplementationProvider: typeof facade.ImplementationProvider = facade.ImplementationProvider;
