import { Card, equalCard } from "@/domains/card";
import { selector, useRecoilValue } from "recoil";
import currentGamePlayerState from "../atoms/current-game-player-state";
import currentGameState from "../atoms/current-game-state";
import SelectorKeys from "./key";

type State = {
  index: number | undefined;
  card: Card | undefined;
};

const internalState = selector<State | undefined>({
  key: SelectorKeys.currentPlayerSelectedCardState,
  get: ({ get }) => {
    const game = get(currentGameState);
    const currentUser = get(currentGamePlayerState);
    if (!game || !currentUser) {
      return;
    }

    const userHand = game.hands.find((v) => v.gamePlayerId === currentUser.id);
    if (!userHand) {
      return;
    }

    const index = game.cards.findIndex((v) => (userHand.card ? equalCard(v, userHand.card) : false));

    return {
      index,
      card: userHand.card,
    };
  },
});

export default function currentPlayerSelectedCardState() {
  return useRecoilValue(internalState);
}
