import { asStoryPoint } from "@/domains/card";
import { Future, pendingOf, valueOf } from "@/status/util";
import { selector } from "recoil";
import { ShowDownResultViewModel } from "../types";
import currentGameState from "./current-game-state";
import SelectorKeys from "./key";

const showDownResultState = selector<Future<ShowDownResultViewModel>>({
  key: SelectorKeys.showDownResultState,
  get: ({ get }) => {
    const game = get(currentGameState).valueMaybe()?.viewModel;
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
  },
});

export default showDownResultState;
