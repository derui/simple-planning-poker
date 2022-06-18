import { gameStore } from "@/status/game/signals/game-query";
import { GameState, GameViewModel } from "@/status/game/types";
import { Future, pendingOf, valueOf } from "@/status/util";
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
  createMemo<Future<GameState>>(() => {
    const loadable = gameStore.viewModel;

    if (gameStore.state === "loading") {
      return pendingOf();
      // } else if (gameStore.state ) {
      //   return errorOf();
    } else {
      if (loadable) {
        return valueOf<GameState>({
          viewModel: loadable,
          status: toStatus(loadable),
        });
      }
      return pendingOf();
    }
  });

export { currentGameState };
