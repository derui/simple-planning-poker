import { gameStore } from "@/status/game/signals/game-query";
import { GameState, GameViewModel } from "@/status/game/types";
import { createMemo } from "solid-js";

const toStatus = (game: GameViewModel) => {
  if (game.showedDown) {
    return "ShowedDown";
  }

  if (game.hands.some((v) => v.selected)) {
    return "CanShowDown";
  }

  return "EmptyUserHand";
};

const currentGameState = () =>
  createMemo<GameState | null>((prev) => {
    const loadable = gameStore.viewModel;

    if (gameStore.state === "loading") {
      return prev;
    } else {
      if (loadable) {
        return {
          viewModel: loadable,
          status: toStatus(loadable),
        };
      }
      return null;
    }
  }, null);

export { currentGameState };
