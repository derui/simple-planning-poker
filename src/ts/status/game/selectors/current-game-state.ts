import { selector, useRecoilValue } from "recoil";
import currentGameIdState from "../atoms/current-game-id-state";
import gameState from "../atoms/game-state";
import { GameViewModel } from "../types";
import SelectorKeys from "./key";

const state = selector<GameViewModel | undefined>({
  key: SelectorKeys.currentGameState,
  get: ({ get }) => {
    const gameId = get(currentGameIdState);
    if (!gameId) {
      return;
    }

    return get(gameState(gameId));
  },
});

export default function currentGameState() {
  return useRecoilValue(state);
}
