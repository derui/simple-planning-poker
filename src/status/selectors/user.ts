import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserMode } from "@/domains/game-player";
import { Loading } from "@/type";

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
  return createDraftSafeSelector(
    [selectUser, selectGame],
    ({ currentUser }, { currentGame }): [UserInfo | undefined, Loading] => {
      if (!currentUser || !currentGame) {
        return [undefined, "loading"];
      }

      const userMode = currentGame.joinedPlayers.find((v) => v.user === currentUser.id)?.mode;
      if (!userMode) {
        return [undefined, "finished"];
      }

      return [{ userName: currentUser.name, userMode }, "finished"];
    }
  );
};
