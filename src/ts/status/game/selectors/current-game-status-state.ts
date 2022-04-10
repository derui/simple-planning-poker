import { selector } from "recoil";
import { GameStatus } from "../types";
import currentGameState from "./current-game-state";
import SelectorKeys from "./key";

const currentGameStatusState = selector<GameStatus>({
  key: SelectorKeys.currentGameStatusState,
  get: ({ get }) => {
    const game = get(currentGameState);
    if (!game) {
      return "EmptyUserHand";
    }

    if (game.showedDown) {
      return "ShowedDown";
    }

    if (game.hands.some((v) => v.selected)) {
      return "CanShowDown";
    }

    return "EmptyUserHand";
  },
});

export default currentGameStatusState;
