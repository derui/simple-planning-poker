import { Card } from "@/domains/card";
import { Future, pendingOf, valueOf } from "@/status/util";
import { selector } from "recoil";
import currentGameState from "./current-game-state";
import SelectorKeys from "./key";

const selectableCardsState = selector<Future<Card[]>>({
  key: SelectorKeys.cardsInGameState,
  get: ({ get }) => {
    const game = get(currentGameState).valueMaybe()?.viewModel;

    if (!game) {
      return pendingOf();
    }

    return valueOf(game.cards);
  },
});

export default selectableCardsState;
