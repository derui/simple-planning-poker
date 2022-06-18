import { gameCreationState } from "@/status/game/signals/game-creation-state";
import { createMemo } from "solid-js";

const gameCreatingState = () =>
  createMemo(() => {
    return gameCreationState().creating;
  });

export { gameCreatingState };
