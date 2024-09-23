import { createFacade } from "@spp/shared-hook-facade";
import { UseCreateGame, UseListGame, UsePrepareGame } from "../atoms/game.js";

export type Hooks = {
  useCreateGame: UseCreateGame;
  usePrepareGame: UsePrepareGame;
  useListGame: UseListGame;
};

const { hooks, ImplementationProvider } = createFacade<Hooks>();

export { hooks, ImplementationProvider };
