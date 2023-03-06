import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as Loadable from "@/utils/loadable";
import * as Game from "@/domains/game";
import * as Round from "@/domains/round";

const selectSelf = (state: RootState) => state;
const selectGame = createDraftSafeSelector(selectSelf, (state) => state.game);
const selectCurrentGame = createDraftSafeSelector(selectGame, (state) => state.currentGame);

export const selectCurrentGameName = function selectCurrentGameName() {
  return createDraftSafeSelector(selectCurrentGame, (currentGame): Loadable.T<string> => {
    if (!currentGame) {
      return Loadable.loading();
    }

    return Loadable.finished(currentGame.name);
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
