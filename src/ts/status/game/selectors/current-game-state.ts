import { errorOf, Future, pendingOf, valueOf } from "@/status/util";
import { noWait, selector } from "recoil";
import currentGameIdState from "../atoms/current-game-id-state";
import gameQuery from "../atoms/game-query";
import { GameState, GameViewModel } from "../types";
import SelectorKeys from "./key";

const toStatus = (game: GameViewModel) => {
  if (game.showedDown) {
    return "ShowedDown";
  }

  if (game.hands.some((v) => v.selected)) {
    return "CanShowDown";
  }

  return "EmptyUserHand";
};

const currentGameState = selector<Future<GameState>>({
  key: SelectorKeys.currentGameState,
  get: ({ get }) => {
    const gameId = get(currentGameIdState);
    if (!gameId) {
      return pendingOf();
    }

    const loadable = get(noWait(gameQuery(gameId)));

    return {
      hasValue: () => {
        if (loadable.contents) {
          return valueOf<GameState>({
            viewModel: loadable.contents as GameViewModel,
            status: toStatus(loadable.contents),
          });
        }
        return pendingOf();
      },
      hasError: () => errorOf(),
      loading: () => pendingOf(),
    }[loadable.state]();
  },
});

export default currentGameState;
