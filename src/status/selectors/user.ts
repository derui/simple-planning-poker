import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserMode } from "@/domains/game-player";
import * as Game from "@/domains/game";
import * as Loadable from "@/utils/loadable";

const selectSelf = (state: RootState) => state;
const selectUser = createDraftSafeSelector(selectSelf, (state) => state.user);
const selectCurrentUser = createDraftSafeSelector(selectUser, (state) => state.currentUser);
const selectCurrentUserJoinedGames = createDraftSafeSelector(selectUser, (state) => state.currentUserJoinedGames);
const selectRound = createDraftSafeSelector(selectSelf, (state) => state.round);
const selectCurrentRound = createDraftSafeSelector(selectRound, (state) => state.instance);

export interface UserInfo {
  userName: string;
  userMode: UserMode;
}

/**
 * return UserInfo in current game with current user
 */
export const selectUserInfo = function selectUserInfo() {
  return createDraftSafeSelector(
    [selectCurrentUser, selectCurrentRound],
    (currentUser, round): Loadable.T<UserInfo> => {
      if (!currentUser || !round) {
        return Loadable.loading();
      }

      const userMode = round.joinedPlayers[currentUser.id];
      if (!userMode) {
        return Loadable.error();
      }

      return Loadable.finished({ userName: currentUser.name, userMode });
    }
  );
};

interface JoinedGameModel {
  gameId: Game.Id;
  name: string;
}

/**
 * return games that are joined current user before
 */
export const selectJoinedGames = function selectJoinedGames() {
  return createDraftSafeSelector(selectCurrentUserJoinedGames, (games): JoinedGameModel[] => {
    return Object.entries(games)
      .map(([key, value]) => {
        return { gameId: Game.createId(key), name: value };
      })
      .sort(({ name: o1 }, { name: o2 }) => o1.localeCompare(o2));
  });
};
