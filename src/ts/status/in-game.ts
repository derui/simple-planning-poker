import { AtomKeys, SelectorKeys } from "./key";
import { atom, selector, useRecoilCallback, useRecoilValue } from "recoil";
import { signInSelectors } from "./signin";
import { Game, GameId } from "@/domains/game";
import { Card, equalCard } from "@/domains/card";
import { GameRepository } from "@/domains/game-repository";
import { HandCardUseCase } from "@/usecases/hand-card";
import { ShowDownUseCase } from "@/usecases/show-down";
import { NewGameUseCase } from "@/usecases/new-game";

export interface InGameAction {
  useSelectCard: () => (card: Card) => void;
  useNewGame: () => () => void;
  useShowDown: () => () => void;
  useSetCurrentGame: () => (gameId: GameId) => void;
}

const currentGameState = atom<Game | null>({
  key: AtomKeys.currentGameState,
  default: null,
});

const currentSelectableCards = selector({
  key: SelectorKeys.inGameCurrentSelectableCards,
  get: ({ get }) => {
    const game = get(currentGameState);
    if (!game) {
      return [];
    }

    return game.selectableCards.cards;
  },
});

const currentUserSelectableCard = selector({
  key: SelectorKeys.inGameCurrentUserSelectedCard,
  get: ({ get }) => {
    const game = get(currentGameState);
    const currentUser = signInSelectors.useCurrentUser();
    const userId = currentUser.id;
    if (!game || userId) {
      return;
    }

    const userHand = game.userHands.find((v) => v.userId === userId);
    if (!userHand) {
      return;
    }

    return game.selectableCards.cards.findIndex((v) => equalCard(v, userHand.card));
  },
});

export const createInGameAction = (
  gameRepository: GameRepository,
  handCardUseCase: HandCardUseCase,
  showDownUseCase: ShowDownUseCase,
  newGameUseCase: NewGameUseCase
): InGameAction => {
  return {
    useSelectCard: () =>
      useRecoilCallback(({ set }) => async (card: Card) => {
        const currentUser = signInSelectors.useCurrentUser();
        const currentGame = useRecoilValue(currentGameState);

        if (!currentUser.id || !currentGame) {
          return;
        }

        await handCardUseCase.execute({
          gameId: currentGame.id,
          userId: currentUser.id,
          card,
        });
        const game = await gameRepository.findBy(currentGame.id);
        set(currentGameState, (prev) => {
          return game || prev;
        });
      }),
    useNewGame: () =>
      useRecoilCallback(({ set }) => async () => {
        const currentGame = useRecoilValue(currentGameState);
        if (!currentGame) {
          return;
        }

        await newGameUseCase.execute({
          gameId: currentGame.id,
        });

        const game = await gameRepository.findBy(currentGame.id);
        set(currentGameState, (prev) => {
          return game || prev;
        });
      }),
    useShowDown: () =>
      useRecoilCallback(({ set }) => async () => {
        const currentGame = useRecoilValue(currentGameState);

        if (!currentGame) {
          return;
        }

        await showDownUseCase.execute({
          gameId: currentGame.id,
        });

        const game = await gameRepository.findBy(currentGame.id);
        set(currentGameState, (prev) => {
          return game || prev;
        });
      }),

    useSetCurrentGame: () =>
      useRecoilCallback(({ set }) => async (gameId: GameId) => {
        const game = await gameRepository.findBy(gameId);
        set(currentGameState, (prev) => {
          return game || prev;
        });
      }),
  };
};

export const inGameSelectors = {
  currentSelectableCards: () => useRecoilValue(currentSelectableCards),
  currentUserSelectedCard: () => useRecoilValue(currentUserSelectableCard),
};
