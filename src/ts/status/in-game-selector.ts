import { SelectorKeys } from "./key";
import { selector, useRecoilValue } from "recoil";
import { asStoryPoint, Card, equalCard } from "@/domains/card";
import { GameViewModel, setUpAtomsInGame, ShowDownResultViewModel, UserHandViewModel } from "./in-game-atom";
import { GamePlayerId, UserMode } from "@/domains/game-player";

export type InGameStatus = "EmptyUserHand" | "CanShowDown" | "ShowedDown";

export interface InGameSelector {
  currentGameName: () => string;
  currentUserMode: () => UserMode | undefined;
  currentSelectableCards: () => Card[];
  currentUserSelectedCardIndex: () => number | undefined;
  currentGameStatus: () => InGameStatus;
  upperLineUserHands: () => UserHandViewModel[];
  lowerLineUserHands: () => UserHandViewModel[];
  showDownResult: () => ShowDownResultViewModel;
}

export const createInGameSelectors = (): InGameSelector => {
  const { gameStateQuery, gamePlayerQuery } = setUpAtomsInGame();

  const currentSelectableCards = selector({
    key: SelectorKeys.inGameCurrentSelectableCards,
    get: ({ get }) => {
      const game = get(gameStateQuery);
      if (!game) {
        return [];
      }

      return game.cards;
    },
  });

  const currentUserMode = selector({
    key: SelectorKeys.inGameCurrentUserMode,
    get: ({ get }) => {
      const game = get(gameStateQuery);
      const currentUser = get(gamePlayerQuery);
      if (!game || !currentUser) {
        return;
      }

      const user = game.hands.find((v) => v.gamePlayerId === currentUser.id);
      if (!user) {
        return;
      }

      return user.mode;
    },
  });

  const currentUserSelectedCardIndex = selector({
    key: SelectorKeys.inGameCurrentUserSelectedCard,
    get: ({ get }) => {
      const game = get(gameStateQuery);
      const currentUser = get(gamePlayerQuery);
      if (!game || !currentUser) {
        return;
      }

      const userHand = game.hands.find((v) => v.gamePlayerId === currentUser.id);
      if (!userHand) {
        return;
      }

      return game.cards.findIndex((v) => (userHand.card ? equalCard(v, userHand.card) : false));
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

  const makeUserHandsInGame = (game: GameViewModel, users: GamePlayerId[]) => {
    return users
      .map((user) => {
        return game.hands.find((v) => v.gamePlayerId === user);
      })
      .filter((v) => !!v)
      .map((v) => v!);
  };

  const upperLineUserHands = selector({
    key: SelectorKeys.inGameUpperLineUserHands,
    get: ({ get }) => {
      const game = get(gameStateQuery);
      if (!game) {
        return [];
      }
      const users = game.hands.filter((_, index) => index % 2 == 0).map((v) => v.gamePlayerId);

      return makeUserHandsInGame(game, users);
    },
  });

  const lowerLineUserHands = selector({
    key: SelectorKeys.inGameLowerLineUserHands,
    get: ({ get }) => {
      const game = get(gameStateQuery);
      if (!game) {
        return [];
      }
      const users = game.hands.filter((_, index) => index % 2 == 1).map((v) => v.gamePlayerId);

      return makeUserHandsInGame(game, users);
    },
  });

  const currentGameStatus = selector<InGameStatus>({
    key: SelectorKeys.inGameCurrentGameStatus,
    get: ({ get }) => {
      const game = get(gameStateQuery);
      if (!game) {
        return "EmptyUserHand";
      }

      if (game.hands.some((v) => v.selected)) {
        return "CanShowDown";
      }

      if (game.showedDown) {
        return "ShowedDown";
      }

      return "EmptyUserHand";
    },
  });

  const showDownResult = selector<ShowDownResultViewModel>({
    key: SelectorKeys.inGameShowDownResult,
    get: ({ get }) => {
      const game = get(gameStateQuery);
      if (!game || !game.showedDown) {
        return { cardCounts: [], average: 0 };
      }

      const points = game.hands
        .map((v) => {
          return v?.card ? asStoryPoint(v.card)?.value : undefined;
        })
        .filter((v) => v !== undefined && v >= 0)
        .reduce((accum, v) => {
          accum[v!!] = (accum[v!!] ?? 0) + 1;
          return accum;
        }, {} as { [key: number]: number });
      const cardCounts = Object.entries(points).map(([k, v]) => [Number(k), v] as [number, number]);
      const average = game.average ?? 0;

      return { average, cardCounts };
    },
  });

  return {
    currentGameName: () => useRecoilValue(currentGameName),
    currentUserMode: () => useRecoilValue(currentUserMode),
    currentSelectableCards: () => useRecoilValue(currentSelectableCards),
    currentUserSelectedCardIndex: () => useRecoilValue(currentUserSelectedCardIndex),
    upperLineUserHands: () => useRecoilValue(upperLineUserHands),
    lowerLineUserHands: () => useRecoilValue(lowerLineUserHands),
    currentGameStatus: () => useRecoilValue(currentGameStatus),
    showDownResult: () => useRecoilValue(showDownResult),
  };
};
