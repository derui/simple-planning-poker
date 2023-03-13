import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as Loadable from "@/utils/loadable";
import * as Game from "@/domains/game";
import * as UserHand from "@/domains/user-hand";

const selectSelf = (state: RootState) => state;
const selectGame = createDraftSafeSelector(selectSelf, (state) => state.game);
const selectCurrentGame = createDraftSafeSelector(selectGame, (state) => state.currentGame);
const selectUser = createDraftSafeSelector(selectSelf, (state) => state.user);
const selectCurrentUser = createDraftSafeSelector(selectUser, (state) => state.currentUser);
const selectRound = createDraftSafeSelector(selectSelf, (state) => state.round);

/**
 * return current game id if it was loaded.
 */
export const selectCurrentGameId = function selectCurrentGameId() {
  return createDraftSafeSelector(selectCurrentGame, (game) => {
    return game?.id;
  });
};

/**
 * return current round id if it was loaded.
 */
export const selectCurrentRoundId = function selectCurrentRoundId() {
  return createDraftSafeSelector(selectRound, (round) => {
    return round.instance?.id;
  });
};

/**
 * select current game name if it was loaded
 */
export const selectCurrentGameName = function selectCurrentGameName() {
  return createDraftSafeSelector(selectCurrentGame, (currentGame): Loadable.T<string> => {
    if (!currentGame) {
      return Loadable.loading();
    }

    return Loadable.finished(currentGame.name);
  });
};

export interface CardInfo {
  display: string;
  index: number;
}

/**
 * select cards that are selectable in current game.
 */
export const selectCards = function selectCards() {
  return createDraftSafeSelector(selectCurrentGame, (game): Loadable.T<CardInfo[]> => {
    if (!game) {
      return Loadable.loading();
    }

    const cards = game.cards.map((c, index) => ({ display: `${c}`, index }));

    return Loadable.finished(cards);
  });
};

export type PlayerHandInfo = {
  hand: UserHand.T;
  cardIndex: number;
};

/**
 * return status of creating
 */
export const selectGameCreatingStatus = function selectGameCreatingStatus() {
  return createDraftSafeSelector(selectGame, (game) => game.status.creating);
};

/**
 * select player hand that did current player
 */
export const selectPlayerHandedCard = function selectPlayerHandedCard() {
  return createDraftSafeSelector([selectRound, selectCurrentUser], ({ instance: round }, user): PlayerHandInfo => {
    if (!round || !user) {
      return { hand: UserHand.unselected(), cardIndex: -1 };
    }

    const hand = round.hands[user.id];
    if (!hand) {
      return { hand: UserHand.unselected(), cardIndex: -1 };
    }

    let cardIndex = -1;
    if (UserHand.isHanded(hand)) {
      cardIndex = round.cards[hand.card].order;
    }

    return { hand, cardIndex };
  });
};

/**
 * select invitation link of the current game.
 */
export const selectCurrentGameInvitationLink = function selectCurrentGameInvitationLink() {
  return createDraftSafeSelector(selectCurrentGame, (currentGame): Loadable.T<string> => {
    if (!currentGame) {
      return Loadable.loading();
    }

    const invitation = Game.makeInvitation(currentGame);

    return Loadable.finished(`/invitation/${invitation}`);
  });
};

/**
 * select flag to be able to hold new round
 */
export const selectCanShowDown = function selectCanShowDown() {
  return createDraftSafeSelector(selectRound, ({ instance }): boolean => {
    if (!instance) {
      return false;
    }

    return instance.state === "ShowDownPrepared";
  });
};

interface RoundResultInfo {
  average: number;
  cardAndCounts: [number, number][];
}

export const selectRoundResult = function selectRoundResult() {
  return createDraftSafeSelector(selectRound, ({ instance: round }): Loadable.T<RoundResultInfo> => {
    if (!round) {
      return Loadable.loading();
    }

    if (round.state !== "Finished") {
      return Loadable.error();
    }

    const average = round.averagePoint;

    const handMap = new Map<number, number>();

    Object.values(round.hands).forEach((v) => {
      if (UserHand.isHanded(v)) {
        const count = handMap.get(v.card) ?? 1;
        handMap.set(v.card, count);
      }
    });

    return Loadable.finished({
      average,
      cardAndCounts: Array.from(handMap.entries()).sort(([v1], [v2]) => v1 - v2),
    });
  });
};
