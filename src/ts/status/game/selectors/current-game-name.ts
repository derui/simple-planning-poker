import { selector } from "recoil";
import currentGameState from "./current-game-state";
import SelectorKeys from "./key";

const currentGameName = selector({
  key: SelectorKeys.currentGameName,
  get: ({ get }) => get(currentGameState)?.name ?? "",
});

export default currentGameName;
