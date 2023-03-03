import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserMode } from "@/domains/game-player";
import * as Loadable from "@/utils/loadable";

const selectSelf = (state: RootState) => state;
const selectUser = createDraftSafeSelector(selectSelf, (state) => state.user);
const selectGame = createDraftSafeSelector(selectSelf, (state) => state.game);

export interface UserInfo {
  userName: string;
  userMode: UserMode;
}

/**
 * return UserInfo in current game with current user
 */
export const selectUserInfo = function selectUserInfo() {
  return createDraftSafeSelector([selectUser, selectGame], ({ currentUser }, { currentGame }): Loadable.T<UserInfo> => {
    if (!currentUser || !currentGame) {
      return Loadable.loading();
    }

    const userMode = currentGame.joinedPlayers.find((v) => v.user === currentUser.id)?.mode;
    if (!userMode) {
      return Loadable.error();
    }

    return Loadable.finished({ userName: currentUser.name, userMode });
  });
};
