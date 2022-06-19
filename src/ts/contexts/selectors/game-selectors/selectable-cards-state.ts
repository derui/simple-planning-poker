import { Card } from "@/domains/card";
import { Future, pendingOf, valueOf } from "@/status/util";
import { createMemo } from "solid-js";
import { currentGameState } from "./current-game-state";

const selectableCardsState = () =>
  createMemo<Future<Card[]>>(() => {
    const gameState = currentGameState();
    const game = gameState()?.viewModel;

    if (!game) {
      return pendingOf();
    }

    return valueOf(game.cards);
  });

export { selectableCardsState };
