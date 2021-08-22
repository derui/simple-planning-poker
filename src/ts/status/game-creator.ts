import { AtomKeys } from "./key";
import { atom, constSelector, useRecoilCallback, useRecoilValue } from "recoil";
import { useCallback } from "react";
import { CreateGameUseCase } from "@/usecases/create-game";
import { signInSelectors } from "./signin";
import { GameId } from "@/domains/game";

export interface GameCreationAction {
  useCreateGame: () => (callback: (gameId: GameId) => void) => void;
  useSetName: () => (name: string) => void;
  useSetCards: () => (cards: string) => void;
}

interface GameCreationState {
  name: string;
  cards: number[];
  creating: boolean;
}

const DEFAULT_CARDS = "1,2,3,5,8,13,21,34,55,89".split(",").map((v) => Number(v));

const gameCreationState = atom<GameCreationState>({
  key: AtomKeys.gameCreationState,
  default: {
    name: "",
    cards: DEFAULT_CARDS,
    creating: false,
  },
});

export const createGameCreationAction = (useCase: CreateGameUseCase): GameCreationAction => {
  return {
    useCreateGame: () => {
      const currentUser = signInSelectors.useCurrentUser();
      return useRecoilCallback(
        ({ snapshot }) =>
          (callback: (gameId: GameId) => void) => {
            const state = snapshot.getLoadable(gameCreationState).valueOrThrow();
            const currentUserId = currentUser.id;
            if (state.name === "" || state.cards.length === 0 || !currentUserId) {
              return;
            }

            const input = {
              name: state.name,
              points: state.cards,
              createdBy: { userId: currentUserId, name: currentUser.name },
            };

            const ret = useCase.execute(input);
            if (ret.kind === "success") {
              callback(ret.gameId);
            }
          },
        [currentUser]
      );
    },

    useSetName: () =>
      useRecoilCallback(({ set }) => (name: string) => {
        if (name === "") return;
        set(gameCreationState, (prev) => {
          return { ...prev, name };
        });
      }),

    useSetCards: () =>
      useRecoilCallback(({ set }) => (cards: string) => {
        if (cards === "") return;
        if (!/^[0-9 ,]$/.test(cards)) return;

        const numbers = cards
          .replace(" ", "")
          .split(",")
          .map((v) => Number(v));

        set(gameCreationState, (prev) => {
          return { ...prev, cards: numbers };
        });
      }),
  };
};

export const GameCreatorSelector = {
  defaultCards: () => useRecoilValue(constSelector(DEFAULT_CARDS.join(","))),
};
