import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserMode } from "@/domains/game-player";
import * as Game from "@/domains/game";
import * as Loadable from "@/utils/loadable";

const selectSelf = (state: RootState) => state;
const selectUser = createDraftSafeSelector(selectSelf, (state) => state.user);
const selectCurrentUser = createDraftSafeSelector(selectUser, (state) => state.currentUser);
const selectCurrentUserJoinedGames = createDraftSafeSelector(selectUser, (state) => state.currentUserJoinedGames);
const selectGame = createDraftSafeSelector(selectSelf, (state) => state.game);
const selectCurrentGame = createDraftSafeSelector(selectGame, (state) => state.currentGame);

export interface UserInfo {
  userName: string;
  userMode: UserMode;
  owner: boolean;
}

/**
 * return UserInfo in current game with current user
 */
export const selectUserInfo = createDraftSafeSelector(
  selectCurrentUser,
  selectCurrentGame,
  (user, game): Loadable.T<UserInfo> => {
    if (!user || !game) {
      return Loadable.loading();
    }

    const userMode = game.joinedPlayers.find((v) => v.user === user.id)?.mode;
    if (!userMode) {
      return Loadable.error();
    }

    return Loadable.finished({ userName: user.name, userMode, owner: user.id === game.owner });
  }
);

interface JoinedGameModel {
  gameId: Game.Id;
  name: string;
}

/**
 * return games that are joined current user before
 */
export const selectJoinedGames = createDraftSafeSelector(selectCurrentUserJoinedGames, (games): JoinedGameModel[] => {
  return Object.entries(games)
    .map(([key, value]) => {
      return { gameId: Game.createId(key), name: value };
    })
    .sort(({ name: o1 }, { name: o2 }) => o1.localeCompare(o2));
});
