import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as Loadable from "@/utils/loadable";
import * as Game from "@/domains/game";
import * as UserEstimation from "@/domains/user-estimation";

const selectSelf = (state: RootState) => state;
const selectGame = createDraftSafeSelector(selectSelf, (state) => state.game);
const selectCurrentGame = createDraftSafeSelector(selectGame, (state) => state.currentGame);
const selectUser = createDraftSafeSelector(selectSelf, (state) => state.user);
const selectCurrentUser = createDraftSafeSelector(selectUser, (state) => state.currentUser);
const selectRound = createDraftSafeSelector(selectSelf, (state) => state.round);
const selectRoundInstance = createDraftSafeSelector(selectRound, (state) => state.instance);

/**
 * return current game id if it was loaded.
 */
export const selectCurrentGameId = createDraftSafeSelector(selectCurrentGame, (game) => {
  return game?.id;
});

/**
 * return current round id if it was loaded.
 */
export const selectCurrentRoundId = createDraftSafeSelector(selectRoundInstance, (round) => {
  return round?.id;
});

/**
 * select current game name if it was loaded
 */
export const selectCurrentGameName = createDraftSafeSelector(selectCurrentGame, (currentGame): Loadable.T<string> => {
  if (!currentGame) {
    return Loadable.loading();
  }

  return Loadable.finished(currentGame.name);
});

export interface CardInfo {
  display: string;
  index: number;
}

/**
 * select cards that are selectable in current game.
 */
export const selectCards = createDraftSafeSelector(selectCurrentGame, (game): Loadable.T<CardInfo[]> => {
  if (!game) {
    return Loadable.loading();
  }

  const cards = game.cards.map((c, index) => ({ display: `${c}`, index }));

  return Loadable.finished(cards);
});

export type PlayerHandInfo = {
  hand: UserEstimation.T;
  cardIndex: number;
};

/**
 * return status of creating
 */
export const selectGameCreatingStatus = createDraftSafeSelector(selectGame, (game) => game.status.creating);

/**
 * select player hand that did current player
 */
export const selectPlayerHandedCard = createDraftSafeSelector(
  selectRoundInstance,
  selectCurrentUser,
  (round, user): PlayerHandInfo => {
    if (!round || !user) {
      return { hand: UserEstimation.unselected(), cardIndex: -1 };
    }

    const hand = round.hands[user.id];
    if (!hand) {
      return { hand: UserEstimation.unselected(), cardIndex: -1 };
    }

    let cardIndex = -1;
    if (UserEstimation.isEstimated(hand)) {
      cardIndex = round.cards[hand.card].order;
    }

    return { hand, cardIndex };
  }
);

/**
 * select invitation link of the current game.
 */
export const selectCurrentGameInvitationLink = createDraftSafeSelector(
  selectCurrentGame,
  (currentGame): Loadable.T<string> => {
    if (!currentGame) {
      return Loadable.loading();
    }

    const invitation = Game.makeInvitation(currentGame);

    return Loadable.finished(`/invitation/${invitation}`);
  }
);

/**
 * select flag to be able to hold new round
 */
export const selectCanShowDown = createDraftSafeSelector(selectRoundInstance, (instance): boolean => {
  if (!instance) {
    return false;
  }

  return instance.state === "ShowDownPrepared";
});

interface RoundResultInfo {
  average: number;
  cardAndCounts: [number, number][];
}

export const selectRoundResult = createDraftSafeSelector(selectRoundInstance, (round): Loadable.T<RoundResultInfo> => {
  if (!round) {
    return Loadable.loading();
  }

  if (round.state !== "Finished") {
    return Loadable.error();
  }

  const average = round.averagePoint;

  const handMap = new Map<number, number>();

  Object.values(round.hands).forEach((v) => {
    if (UserEstimation.isEstimated(v)) {
      const count = handMap.get(v.card) ?? 1;
      handMap.set(v.card, count);
    }
  });

  return Loadable.finished({
    average,
    cardAndCounts: Array.from(handMap.entries()).sort(([v1], [v2]) => v1 - v2),
  });
});

/**
 * return status of round
 */
export const selectRoundStatus = createDraftSafeSelector(selectRoundInstance, (round) => {
  if (!round) {
    return Loadable.loading();
  }

  return Loadable.finished({ id: round.id, state: round.state });
});
