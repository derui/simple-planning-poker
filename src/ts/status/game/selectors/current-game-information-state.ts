import { selector } from "recoil";
import currentGameState from "./current-game-state";
import SelectorKeys from "./key";

type State = {
  name?: string;
  cards: number[];
  invitationSignature?: string;
};

const currentGameInformationState = selector<State>({
  key: SelectorKeys.currentGameName,
  get: ({ get }) => {
    const state = get(currentGameState);
    const name = state?.name;
    const invitationSignature = state?.invitationSignature;
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

    return { name, cards, invitationSignature };
  },
});

export default currentGameInformationState;
