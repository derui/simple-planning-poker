import { Card, equalCard } from "@/domains/card";
import { currentGamePlayerState } from "@/status/game/signals/current-game-player-state";
import { Future, pendingOf, valueOf } from "@/status/util";
import { createMemo } from "solid-js";
import { currentGameState } from "./current-game-state";

type State = {
  index: number | undefined;
  card: Card | undefined;
};

const currentPlayerSelectedCardState = () =>
  createMemo<Future<State | undefined>>(() => {
    const game = currentGameState()();
    const currentPlayer = currentGamePlayerState();
    if (!game || !currentPlayer) {
      return pendingOf();
    }
    const viewModel = game.viewModel;

    const userHand = viewModel.hands.find((v) => v.gamePlayerId === currentPlayer.id);
    if (!userHand) {
      return valueOf(undefined);
    }

    const index = viewModel.cards.findIndex((v) => (userHand.card ? equalCard(v, userHand.card) : false));

    return valueOf({
      index,
      card: userHand.card,
    });
  });

export { currentPlayerSelectedCardState };
