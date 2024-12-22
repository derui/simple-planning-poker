import { createFacade } from "@spp/shared-hook-facade";
import { UseCreateGame } from "../atoms/use-create-game.js";
import { UseCurrentGame } from "../atoms/use-current-game.js";
import { UseEditGame } from "../atoms/use-edit-game.js";
import { UseGames } from "../atoms/use-games.js";
import { UseUserInfo } from "../atoms/use-user-info.js";

export type Hooks = {
  useCreateGame: UseCreateGame;
  useEditGame: UseEditGame;
  useGames: UseGames;
  useUserInfo: UseUserInfo;
  useCurrentGame: UseCurrentGame;
};

const facade: ReturnType<typeof createFacade<Hooks>> = createFacade<Hooks>();

export const hooks: Readonly<Hooks> = facade.hooks;
export const ImplementationProvider: typeof facade.ImplementationProvider = facade.ImplementationProvider;
