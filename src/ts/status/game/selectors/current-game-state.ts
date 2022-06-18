import { errorOf, Future, pendingOf, valueOf } from "@/status/util";
import { createMemo } from "solid-js";
import { gameQuery } from "../signals/game-query";
import { GameState, GameViewModel } from "../types";

const toStatus = (game: GameViewModel) => {
  if (game.showedDown) {
    return "ShowedDown";
  }

  if (game.hands.some((v) => v.selected)) {
    return "CanShowDown";
  }

  return "EmptyUserHand";
};

const currentGameState = createMemo<Future<GameState>>(() => {
  const loadable = gameQuery();

  if (gameQuery.loading) {
    return pendingOf();
  } else if (gameQuery.error) {
    return errorOf();
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
