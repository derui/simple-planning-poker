import { createMemo } from "solid-js";
import { gameCreationState } from "../atoms/game-creation-state";

const gameCreatingState = createMemo(() => {
  return gameCreationState().creating;
});

export { gameCreatingState };
