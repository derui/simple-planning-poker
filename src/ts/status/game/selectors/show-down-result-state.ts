import { asStoryPoint } from "@/domains/card";
import { selector, useRecoilValue } from "recoil";
import currentGameState from "../atoms/current-game-state";
import { ShowDownResultViewModel } from "../types";

const state = selector<ShowDownResultViewModel>({
  key: SelectorKeys.showDownResultState,
  get: ({ get }) => {
    const game = get(currentGameState);
    if (!game || !game.showedDown) {
      return { cardCounts: [], average: 0 };
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

    return { average, cardCounts };
  },
});

export default function showDownResultState() {
  return useRecoilValue(state);
}
