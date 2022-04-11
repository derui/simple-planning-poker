import { selector } from "recoil";
import currentGameState from "./current-game-state";
import SelectorKeys from "./key";

type State = {
  name?: string;
  cards: number[];
  invitationSignature?: string;
};

const currentGameInformationState = selector<State>({
  key: SelectorKeys.currentGameInformationState,
  get: ({ get }) => {
    const state = get(currentGameState);
    switch (state.kind) {
      case "loaded": {
        const name = state.viewModel.name;
        const invitationSignature = state.viewModel.invitationSignature;
        const cards =
          state.viewModel.cards
            .map((v) => {
              switch (v.kind) {
                case "storypoint":
                  return v.storyPoint.value;
                default:
                  return null;
              }
            })
            .filter((v) => !!v)
            .map((v): number => v!!) ?? [];

        return { name, cards, invitationSignature };
      }
      default:
        return {
          cards: [],
        };
    }
  },
});

export default currentGameInformationState;
