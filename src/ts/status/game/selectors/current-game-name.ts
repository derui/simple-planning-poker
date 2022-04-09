import { selector, useRecoilValue } from "recoil";
import currentGameState from "../atoms/current-game-state";
import SelectorKeys from "./key";

const state = selector({
  key: SelectorKeys.currentGameName,
  get: ({ get }) => get(currentGameState)?.name ?? [],
});

export default function currentGameName() {
  return useRecoilValue(state);
}
