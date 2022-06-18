import { asStoryPoint } from "@/domains/card";
import { ShowDownResultViewModel } from "@/status/game/types";
import { Future, pendingOf, valueOf } from "@/status/util";
import { createMemo } from "solid-js";
import { currentGameState } from "./current-game-state";

const showDownResultState = () =>
  createMemo<Future<ShowDownResultViewModel>>(() => {
    const gameState = currentGameState();
    const game = gameState().valueMaybe()?.viewModel;
    if (!game || !game.showedDown) {
      return pendingOf();
    }

    const points = game.hands
      .map((v) => {
        return v?.card ? asStoryPoint(v.card)?.value : undefined;
      })
      .filter((v) => v !== undefined && v >= 0)
      .reduce((accum, v) => {
        accum[v!!] = (accum[v!!] ?? 0) + 1;
        return accum;
      }, {} as { [key: number]: number });
    const cardCounts = Object.entries(points).map(([k, v]) => [Number(k), v] as [number, number]);
    const average = game.average ?? 0;

    return valueOf({ average, cardCounts });
  });

export { showDownResultState };
