import { SelectorKeys } from "./key";
import { selector, useRecoilCallback, useRecoilValue } from "recoil";
import { Game, GameId } from "@/domains/game";
import { asStoryPoint, Card, equalCard } from "@/domains/card";
import { GameRepository } from "@/domains/game-repository";
import { HandCardUseCase } from "@/usecases/hand-card";
import { ShowDownUseCase } from "@/usecases/show-down";
import { NewGameUseCase } from "@/usecases/new-game";
import { setUpAtomsInGame } from "./in-game-atom";
import { currentUserState } from "./signin-atom";
import { UserRepository } from "@/domains/user-repository";
import { setUpAtomsUser } from "./user-atom";
import { JoinUserUseCase } from "@/usecases/join-user";
import { UserObserver } from "@/contexts/observer";

interface InGameUserHand {
  name: string;
  storyPoint: number | null;
  showedDown: boolean;
  handed: boolean;
}

export interface ShowDownResult {
  cardCounts: [number, number][];
  average: number;
}

export type InGameStatus = "EmptyUserHand" | "CanShowDown" | "ShowedDown";

export interface InGameAction {
  useSelectCard: () => (index: number) => void;
  useNewGame: () => () => void;
  useJoinUser: () => () => void;
  useShowDown: () => () => void;
  useSetCurrentGame: (gameId: GameId) => (game: Game) => void;

  selectors: {
    currentGameName: () => string;
    currentSelectableCards: () => Card[];
    currentUserSelectedCard: () => number | undefined;
    currentGameStatus: () => InGameStatus;
    upperLineUserHands: () => InGameUserHand[];
    lowerLineUserHands: () => InGameUserHand[];
    showDownResult: () => ShowDownResult;
  };
}

export const createInGameAction = (
  gameRepository: GameRepository,
  userRepository: UserRepository,
  handCardUseCase: HandCardUseCase,
  showDownUseCase: ShowDownUseCase,
  newGameUseCase: NewGameUseCase,
  joinUserUseCase: JoinUserUseCase,
  userObserver: UserObserver
): InGameAction => {
  const { gameStateQuery, currentGameState } = setUpAtomsInGame();
  const { userState } = setUpAtomsUser(userRepository, userObserver);

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
      if (!game || !userId) {
        return;
      }

      const userHand = game.userHands.find((v) => v.userId === userId);
      if (!userHand) {
        return;
      }

      return game.selectableCards.cards.findIndex((v) => equalCard(v, userHand.card));
    },
  });

  const currentUserJoined = selector({
    key: SelectorKeys.inGameCurrentUserJoined,
    get: ({ get }) => {
      const user = get(currentUserState);
      const game = get(gameStateQuery);
      if (!game || !user.id) {
        return false;
      }

      return game.joinedUsers.includes(user.id);
    },
  });

  const currentGameName = selector({
    key: SelectorKeys.inGameCurrentGameName,
    get: ({ get }) => {
      const game = get(gameStateQuery);
      if (!game) {
        return "";
      }

      return game.name;
    },
  });

  const upperLineUserHands = selector({
    key: SelectorKeys.inGameUpperLineUserHands,
    get: ({ get }) => {
      const game = get(gameStateQuery);
      if (!game) {
        return [];
      }
      const users = game.joinedUsers.filter((_, index) => index % 2 == 0);

      return users.map((userId) => {
        const user = get(userState(userId));
        const hand = game.userHands.find((v) => v.userId === userId);
        return {
          name: user?.name ?? "",
          storyPoint: hand ? asStoryPoint(hand.card)?.value ?? null : null,
          showedDown: game.showedDown,
          handed: !!hand,
        };
      });
    },
  });

  const lowerLineUserHands = selector({
    key: SelectorKeys.inGameLowerLineUserHands,
    get: ({ get }) => {
      const game = get(gameStateQuery);
      if (!game) {
        return [];
      }
      const users = game.joinedUsers.filter((_, index) => index % 2 == 1);

      return users.map((userId) => {
        const user = get(userState(userId));
        const hand = game.userHands.find((v) => v.userId === userId);
        return {
          name: user?.name ?? "",
          storyPoint: hand ? asStoryPoint(hand.card)?.value ?? null : null,
          showedDown: game.showedDown,
          handed: !!hand,
        };
      });
    },
  });

  const currentGameStatus = selector<InGameStatus>({
    key: SelectorKeys.inGameCurrentGameStatus,
    get: ({ get }) => {
      const game = get(gameStateQuery);
      if (!game) {
        return "EmptyUserHand";
      }

      if (game.canShowDown()) {
        return "CanShowDown";
      }

      if (game.showedDown) {
        return "ShowedDown";
      }

      return "EmptyUserHand";
    },
  });

  const showDownResult = selector<ShowDownResult>({
    key: SelectorKeys.inGameShowDownResult,
    get: ({ get }) => {
      const game = get(gameStateQuery);
      if (!game || !game.showedDown) {
        return { cardCounts: [], average: 0 };
      }

      const points = game.userHands
        .map((v) => {
          return asStoryPoint(v.card)?.value ?? 0;
        })
        .filter((v) => v > 0)
        .reduce((accum, v) => {
          accum[v] = (accum[v] ?? 0) + 1;
          return accum;
        }, {} as { [key: number]: number });
      const cardCounts = Object.entries(points).map(([k, v]) => [Number(k), v] as [number, number]);
      const average = game.calculateAverage()?.value ?? 0;

      return { average, cardCounts };
    },
  });

  const inGameSelectors = {
    currentGameName: () => useRecoilValue(currentGameName),
    currentSelectableCards: () => useRecoilValue(currentSelectableCards),
    currentUserSelectedCard: () => useRecoilValue(currentUserSelectedCard),
    upperLineUserHands: () => useRecoilValue(upperLineUserHands),
    lowerLineUserHands: () => useRecoilValue(lowerLineUserHands),
    currentGameStatus: () => useRecoilValue(currentGameStatus),
    showDownResult: () => useRecoilValue(showDownResult),
  };

  return {
    useSelectCard: () => {
      const currentUser = useRecoilValue(currentUserState);
      const currentGame = useRecoilValue(gameStateQuery);

      return useRecoilCallback(({ set }) => async (index: number) => {
        if (!currentUser.id || !currentGame) {
          return;
        }
        const card = currentGame.selectableCards.cards[index];

        await handCardUseCase.execute({
          gameId: currentGame.id,
          userId: currentUser.id,
          card,
        });

        const game = await gameRepository.findBy(currentGame.id);
        set(currentGameState, (prev) => {
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
        set(currentGameState, (prev) => {
          return game || prev;
        });
      });
    },

    useJoinUser: () => {
      const currentUser = useRecoilValue(currentUserState);
      const currentGame = useRecoilValue(gameStateQuery);
      const joined = useRecoilValue(currentUserJoined);

      return useRecoilCallback(({ set }) => async () => {
        if (!currentGame || !currentUser.id || joined) {
          return;
        }

        await joinUserUseCase.execute({
          gameId: currentGame.id,
          userId: currentUser.id,
          name: currentUser.name,
        });

        const game = await gameRepository.findBy(currentGame.id);
        set(currentGameState, (prev) => {
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
        set(currentGameState, (prev) => {
          return game || prev;
        });
      });
    },

    useSetCurrentGame: (gameId: GameId) =>
      useRecoilCallback(
        ({ set }) =>
          async (game: Game) => {
            set(currentGameState, () => {
              return game;
            });
          },
        [gameId]
      ),
    selectors: inGameSelectors,
  };
};
