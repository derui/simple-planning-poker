import { selector, useRecoilValue } from "recoil";
import gameCreationState from "../atoms/game-creation-state";
import SelectorKeys from "./key";

const internalState = selector({
  key: SelectorKeys.gameCreatingState,
  get: ({ get }) => {
    return get(gameCreationState).creating;
  },
});

export default function gameCreatingState() {
  return useRecoilValue(internalState);
}
