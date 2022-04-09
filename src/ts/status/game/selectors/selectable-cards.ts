import { selector, useRecoilValue } from "recoil";
import currentGameState from "../atoms/current-game-state";
import SelectorKeys from "./key";

const state = selector({
  key: SelectorKeys.cardsInGameState,
  get: ({ get }) => get(currentGameState)?.cards ?? [],
});

export default function selectableCards() {
  return useRecoilValue(state);
}
