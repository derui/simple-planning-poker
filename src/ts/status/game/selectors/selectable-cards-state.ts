import { selector } from "recoil";
import currentGameState from "./current-game-state";
import SelectorKeys from "./key";

const selectableCardsState = selector({
  key: SelectorKeys.cardsInGameState,
  get: ({ get }) => get(currentGameState)?.cards ?? [],
});

export default selectableCardsState;
