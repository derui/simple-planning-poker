import { constSelector, useRecoilCallback, useRecoilValue } from "recoil";
import { CreateGameUseCase } from "@/usecases/create-game";
import { DEFAULT_CARDS, gameCreationState } from "./game-creator-atom";
import { GameId } from "@/domains/game";
import { signInSelectors } from "./signin";

export interface GameCreationAction {
  useCreateGame: () => (callback: (gameId: GameId) => void) => void;
  useSetName: () => (name: string) => void;
  useSetCards: () => (cards: string) => void;
}

export const createGameCreationActions = (useCase: CreateGameUseCase): GameCreationAction => {
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
        if (!/^[0-9 ,]+$/.test(cards)) return;

        const numbers = cards
          .trim()
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
