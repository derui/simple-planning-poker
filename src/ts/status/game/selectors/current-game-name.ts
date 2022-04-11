import { selector } from "recoil";
import currentGameState from "./current-game-state";
import SelectorKeys from "./key";

const currentGameName = selector({
  key: SelectorKeys.currentGameName,
  get: ({ get }) => {
    const state = get(currentGameState);
    switch (state.kind) {
      case "loaded":
        return state.viewModel.name;
      default:
        return "";
    }
  },
});

export default currentGameName;
