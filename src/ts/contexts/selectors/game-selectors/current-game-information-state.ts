import { gameStore } from "@/status/game/signals/game-query";
import { createMemo } from "solid-js";

type State = {
  name?: string;
  cards: number[];
  invitationSignature?: string;
};

const currentGameInformationState = () =>
  createMemo<State>(() => {
    const state = gameStore.viewModel;

    if (!state) {
      return { cards: [] };
    }

    const name = state.name;
    const invitationSignature = state.invitationSignature;
    const cards =
      state.cards
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
  });

export { currentGameInformationState };
