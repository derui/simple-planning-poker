import { constSelector, useRecoilCallback, useRecoilValue } from "recoil";
import { CreateGameUseCase } from "@/usecases/create-game";
import { DEFAULT_CARDS, gameCreationState } from "./game-creator-atom";
import { GameId } from "@/domains/game";
import { signInSelectors } from "./signin";
import { GamePlayerRepository } from "@/domains/game-player-repository";
import { setUpAtomsInGame } from "./in-game-atom";
import { gamePlayerToViewModel } from "./dxo";

export interface GameCreationAction {
  useCreateGame: () => (callback: (gameId: GameId) => void) => void;
  useSetName: () => (name: string) => void;
  useSetCards: () => (cards: string) => void;
}

export const createGameCreationActions = (
  gamePlayerRepository: GamePlayerRepository,
  useCase: CreateGameUseCase
): GameCreationAction => {
  const { currentGamePlayer } = setUpAtomsInGame();
  return {
    useCreateGame: () => {
      const currentUser = signInSelectors.useCurrentUser();

      return useRecoilCallback(
        ({ set, snapshot }) =>
          async (callback: (gameId: GameId) => void) => {
            const state = snapshot.getLoadable(gameCreationState).valueOrThrow();
            const currentUserId = currentUser.id;
            if (state.name === "" || state.cards.length === 0 || !currentUserId) {
              return;
            }

            const input = {
              name: state.name,
              points: state.cards,
              createdBy: currentUserId,
            };

            const ret = useCase.execute(input);
            if (ret.kind === "success") {
              const player = await gamePlayerRepository.findByUserAndGame(currentUserId, ret.gameId);
              set(currentGamePlayer, (prev) => {
                return player ? gamePlayerToViewModel(player) : prev;
              });
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
