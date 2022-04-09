import { selector, useRecoilValue } from "recoil";
import currentGameState from "../atoms/current-game-state";
import { GameStatus } from "../types";
import SelectorKeys from "./key";

const state = selector<GameStatus>({
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

export default function currentGameStatusState() {
  return useRecoilValue(state);
}
