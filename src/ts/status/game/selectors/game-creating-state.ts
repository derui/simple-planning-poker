import { selector } from "recoil";
import gameCreationState from "../atoms/game-creation-state";
import SelectorKeys from "./key";

const gameCreatingState = selector({
  key: SelectorKeys.gameCreatingState,
  get: ({ get }) => {
    return get(gameCreationState).creating;
  },
});

export default gameCreatingState;
