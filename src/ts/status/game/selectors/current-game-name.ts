import { createMemo } from "solid-js";
import { currentGameState } from "./current-game-state";

const currentGameName = createMemo(() => {
  const state = currentGameState().valueMaybe()?.viewModel;
  if (!state) {
    return "";
  }

  return state.name;
});

export { currentGameName };
