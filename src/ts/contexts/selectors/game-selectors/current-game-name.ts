import { gameStore } from "@/status/game/signals/game-query";
import { createMemo } from "solid-js";

const currentGameName = () =>
  createMemo(() => {
    const state = gameStore.viewModel;
    if (!state) {
      return "";
    }

    return state.name;
  });

export { currentGameName };
