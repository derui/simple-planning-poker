import { createFacade } from "@spp/shared-hook-facade";
import { useCreateGame, UseCreateGame } from "../atoms/use-create-game.js";
import { useCurrentGame, UseCurrentGame } from "../atoms/use-current-game.js";
import { useEditGame, UseEditGame } from "../atoms/use-edit-game.js";
import { useGames, UseGames } from "../atoms/use-games.js";
import { useUserInfo, UseUserInfo } from "../atoms/use-user-info.js";

export type Hooks = {
  useCreateGame: UseCreateGame;
  useEditGame: UseEditGame;
  useGames: UseGames;
  useUserInfo: UseUserInfo;
  useCurrentGame: UseCurrentGame;
};

const facade: ReturnType<typeof createFacade<Hooks>> = createFacade<Hooks>();

export const defaultHooks: Hooks = {
  useCreateGame: useCreateGame,
  useEditGame: useEditGame,
  useGames: useGames,
  useUserInfo: useUserInfo,
  useCurrentGame: useCurrentGame,
};
export const hooks: Readonly<Hooks> = facade.hooks;
export const ImplementationProvider: typeof facade.ImplementationProvider = facade.ImplementationProvider;
