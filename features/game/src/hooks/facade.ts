import { createFacade } from "@spp/shared-hook-facade";
import { UseCreateGame } from "../atoms/create-game.js";
import { UseGameDetail } from "../atoms/game-detail.js";
import { UseListGames } from "../atoms/list-games.js";
import { UseUserHeader } from "../atoms/user-header.js";

export type Hooks = {
  useCreateGame: UseCreateGame;
  useListGames: UseListGames;
  useUserHeader: UseUserHeader;
  useGameDetail: UseGameDetail;
};

const facade: ReturnType<typeof createFacade<Hooks>> = createFacade<Hooks>();

export const hooks: Readonly<Hooks> = facade.hooks;
export const ImplementationProvider: typeof facade.ImplementationProvider = facade.ImplementationProvider;
