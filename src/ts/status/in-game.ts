import { SelectorKeys } from "./key";
import { selector, useRecoilCallback, useRecoilValue } from "recoil";
import { Game, GameId } from "@/domains/game";
import { Card, equalCard } from "@/domains/card";
import { GameRepository } from "@/domains/game-repository";
import { HandCardUseCase } from "@/usecases/hand-card";
import { ShowDownUseCase } from "@/usecases/show-down";
import { NewGameUseCase } from "@/usecases/new-game";
import { setUpAtomsInGame } from "./in-game-atom";
import { currentUserState } from "./signin-atom";

export interface InGameAction {
  useSelectCard: () => (card: Card) => void;
  useNewGame: () => () => void;
  useShowDown: () => () => void;
  useSetCurrentGame: (gameId: GameId) => (game: Game) => void;

  selectors: {
    currentSelectableCards: () => Card[];
    currentUserSelectedCard: () => number | undefined;
  };
}

export const createInGameAction = (
  gameRepository: GameRepository,
  handCardUseCase: HandCardUseCase,
  showDownUseCase: ShowDownUseCase,
  newGameUseCase: NewGameUseCase
): InGameAction => {
  const { gameStateQuery, currentGameState, currentGameIdState } = setUpAtomsInGame(gameRepository);

  const currentSelectableCards = selector({
    key: SelectorKeys.inGameCurrentSelectableCards,
    get: ({ get }) => {
      const game = get(gameStateQuery);
      if (!game) {
        return [];
      }

      return game.selectableCards.cards;
    },
  });

  const currentUserSelectedCard = selector({
    key: SelectorKeys.inGameCurrentUserSelectedCard,
    get: ({ get }) => {
      const game = get(gameStateQuery);
      const currentUser = get(currentUserState);
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

  const inGameSelectors = {
    currentSelectableCards: () => useRecoilValue(currentSelectableCards),
    currentUserSelectedCard: () => useRecoilValue(currentUserSelectedCard),
  };

  return {
    useSelectCard: () => {
      const currentUser = useRecoilValue(currentUserState);
      const currentGame = useRecoilValue(gameStateQuery);

      return useRecoilCallback(({ set }) => async (card: Card) => {
        if (!currentUser.id || !currentGame) {
          return;
        }

        await handCardUseCase.execute({
          gameId: currentGame.id,
          userId: currentUser.id,
          card,
        });
        const game = await gameRepository.findBy(currentGame.id);
        set(currentGameState(currentGame.id), (prev) => {
          return game || prev;
        });
      });
    },

    useNewGame: () => {
      const currentGame = useRecoilValue(gameStateQuery);

      return useRecoilCallback(({ set }) => async () => {
        if (!currentGame) {
          return;
        }

        await newGameUseCase.execute({
          gameId: currentGame.id,
        });

        const game = await gameRepository.findBy(currentGame.id);
        set(currentGameState(currentGame.id), (prev) => {
          return game || prev;
        });
      });
    },

    useShowDown: () => {
      const currentGame = useRecoilValue(gameStateQuery);

      return useRecoilCallback(({ set }) => async () => {
        if (!currentGame) {
          return;
        }

        await showDownUseCase.execute({
          gameId: currentGame.id,
        });

        const game = await gameRepository.findBy(currentGame.id);
        set(currentGameState(currentGame.id), (prev) => {
          return game || prev;
        });
      });
    },

    useSetCurrentGame: (gameId: GameId) =>
      useRecoilCallback(
        ({ set }) =>
          async () => {
            set(currentGameIdState, () => {
              return gameId;
            });
          },
        [gameId]
      ),
    selectors: inGameSelectors,
  };
};
