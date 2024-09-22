import { createFacade } from "@spp/shared-hook-facade";
import { UseCreateGame } from "../atoms/game.js";

export type Hooks = {
  useCreateGame: UseCreateGame;
};

const { hooks, ImplementationProvider } = createFacade<Hooks>();

export { hooks, ImplementationProvider };
