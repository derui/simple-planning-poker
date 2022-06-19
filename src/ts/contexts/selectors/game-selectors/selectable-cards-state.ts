import { Card } from "@/domains/card";
import { createMemo } from "solid-js";
import { currentGameState } from "./current-game-state";

const selectableCardsState = () =>
  createMemo<Card[]>(() => {
    const gameState = currentGameState();
    const game = gameState()?.viewModel;

    if (!game) {
      return [];
    }

    return game.cards;
  });

export { selectableCardsState };
