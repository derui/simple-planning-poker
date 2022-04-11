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

const currentGameState = selector<GameState>({
  key: SelectorKeys.currentGameState,
  get: ({ get }) => {
    const gameId = get(currentGameIdState);
    if (!gameId) {
      return { kind: "notSelected" };
    }

    const loadable = get(noWait(gameQuery(gameId)));

    return {
      hasValue: () => ({ kind: "loaded", viewModel: loadable.contents, status: toStatus(loadable.contents) }),
      hasError: () => ({ kind: "notSelected" }),
      loading: () => ({ kind: "pending" }),
    }[loadable.state]() as GameState;
  },
});

export default currentGameState;
