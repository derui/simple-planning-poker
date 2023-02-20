import { selector } from "recoil";
import currentGameState from "./current-game-state";
import SelectorKeys from "./key";

const currentGameName = selector({
  key: SelectorKeys.currentGameName,
  get: ({ get }) => {
    const state = get(currentGameState).valueMaybe()?.viewModel;
    if (!state) {
      return "";
    }

    return state.name;
  },
});

export default currentGameName;
