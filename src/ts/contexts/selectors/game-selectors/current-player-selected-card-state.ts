import { Card, equalCard } from "@/domains/card";
import { currentGamePlayerState } from "@/status/game/signals/current-game-player-state";
import { createMemo } from "solid-js";
import { currentGameState } from "./current-game-state";

type State = {
  index: number;
  card: Card | undefined;
};

const currentPlayerSelectedCardState = () =>
  createMemo<State | undefined>(() => {
    const game = currentGameState()();
    const currentPlayer = currentGamePlayerState();
    if (!game || !currentPlayer) {
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
  });

export { currentPlayerSelectedCardState };
