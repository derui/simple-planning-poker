import { Card, equalCard } from "@/domains/card";
import { selector } from "recoil";
import currentGamePlayerState from "../atoms/current-game-player-state";
import currentGameState from "./current-game-state";
import SelectorKeys from "./key";

type State = {
  index: number | undefined;
  card: Card | undefined;
};

const currentPlayerSelectedCardState = selector<State | undefined>({
  key: SelectorKeys.currentPlayerSelectedCardState,
  get: ({ get }) => {
    const game = get(currentGameState);
    const currentPlayer = get(currentGamePlayerState);
    if (game.kind !== "loaded" || !currentPlayer) {
      return;
    }
    const viewModel = game.viewModel;

    const userHand = viewModel.hands.find((v) => v.gamePlayerId === currentPlayer.id);
    if (!userHand) {
      return;
    }

    const index = viewModel.cards.findIndex((v) => (userHand.card ? equalCard(v, userHand.card) : false));

    return {
      index,
      card: userHand.card,
    };
  },
});

export default currentPlayerSelectedCardState;
