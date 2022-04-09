import createUseCreateGame from "@/status/game-creator/actions/use-create-game";
import { createContext } from "react";

export interface GameCreationAction {
  useCreateGame: ReturnType<typeof createUseCreateGame>;
}

// context for GameCreationAction.
const gameCreationActionContext = createContext<GameCreationAction>({} as GameCreationAction);

export default gameCreationActionContext;
