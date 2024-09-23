import { createFacade } from "@spp/shared-hook-facade";
import { UseCreateGame, UsePrepareGame } from "../atoms/game.js";

export type Hooks = {
  useCreateGame: UseCreateGame;
  usePrepareGame: UsePrepareGame;
};

const { hooks, ImplementationProvider } = createFacade<Hooks>();

export { hooks, ImplementationProvider };
