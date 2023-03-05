import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as Loadable from "@/utils/loadable";
import * as Game from "@/domains/game";

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
