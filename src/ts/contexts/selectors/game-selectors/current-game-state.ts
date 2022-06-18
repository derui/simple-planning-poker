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
  createMemo<GameState | null>(() => {
    const loadable = gameStore.viewModel;

    if (gameStore.state === "loading") {
      return null;
      // } else if (gameStore.state ) {
      //   return errorOf();
    } else {
      if (loadable) {
        return {
          viewModel: loadable,
          status: toStatus(loadable),
        };
      }
      return null;
    }
  });

export { currentGameState };
