import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as Loadable from "@/utils/loadable";
import * as Game from "@/domains/game";
import * as Round from "@/domains/round";
import * as UserHand from "@/domains/user-hand";

const selectSelf = (state: RootState) => state;
const selectGame = createDraftSafeSelector(selectSelf, (state) => state.game);
const selectCurrentGame = createDraftSafeSelector(selectGame, (state) => state.currentGame);
const selectUser = createDraftSafeSelector(selectSelf, (state) => state.user);
const selectCurrentUser = createDraftSafeSelector(selectUser, (state) => state.currentUser);

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
 * select player hand that did current player
 */
export const selectPlayerHandedCard = function selectPlayerHandedCard() {
  return createDraftSafeSelector([selectCurrentGame, selectCurrentUser], (game, user): PlayerHandInfo => {
    if (!game || !user) {
      return { hand: UserHand.unselected(), cardIndex: -1 };
    }

    const hand = game.round.hands[user.id];
    if (!hand) {
      return { hand: UserHand.unselected(), cardIndex: -1 };
    }

    let cardIndex = -1;
    if (UserHand.isHanded(hand)) {
      cardIndex = game.cards.findIndex((v) => v === hand.card);
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
  return createDraftSafeSelector(selectCurrentGame, (currentGame): boolean => {
    if (!currentGame) {
      return false;
    }

    return Round.canShowDown(currentGame.round);
  });
};
