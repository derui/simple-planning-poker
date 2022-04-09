import { selector, useRecoilValue } from "recoil";
import currentGameState from "../atoms/current-game-state";
import SelectorKeys from "./key";

type State = {
  name?: string;
  cards: number[];
};

const state = selector<State>({
  key: SelectorKeys.currentGameName,
  get: ({ get }) => {
    const state = get(currentGameState);
    const name = state?.name;
    const cards =
      state?.cards
        ?.map((v) => {
          switch (v.kind) {
            case "storypoint":
              return v.storyPoint.value;
            default:
              return null;
          }
        })
        ?.filter((v) => !!v)
        ?.map((v): number => v!!) ?? [];

    return { name, cards };
  },
});

export default function currentGameInformationState() {
  return useRecoilValue(state);
}
