import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserMode } from "@/domains/game-player";
import * as UserEstimation from "@/domains/user-estimation";
import * as Card from "@/domains/card";
import { filterUndefined } from "@/utils/basic";
import * as Loadable from "@/utils/loadable";

const selectSelf = (state: RootState) => state;
const selectRound = createDraftSafeSelector(selectSelf, (state) => state.round);
const selectRoundInstance = createDraftSafeSelector(selectRound, (state) => state.instance);
const selectUser = createDraftSafeSelector(selectSelf, (state) => state.user);
const selectUsers = createDraftSafeSelector(selectUser, (state) => state.users);
const selectGame = createDraftSafeSelector(selectSelf, (state) => state.game.currentGame);

export type UserEstimationState = "notSelected" | "estimated" | "result";

export interface UserEstimationInfo {
  userName: string;
  userMode: UserMode;
  displayValue: string;
  state: UserEstimationState;
}

/**
 * return UserInfo in current game with current user
 */
export const selectUserEstimationInfos = createDraftSafeSelector(
  selectRoundInstance,
  selectUsers,
  selectGame,
  (round, users, game): Loadable.T<UserEstimationInfo[]> => {
    if (!round || !game) {
      return Loadable.loading();
    }

    const opened = round.state === "Finished";

    const estimations = game.joinedPlayers
      .map(({ user: userId, mode }) => {
        const user = users[userId];

        if (!user) return;

        const estimation = round.estimations[user.id];
        if (!estimation) {
          return { userName: user.name, userMode: mode, displayValue: "?", state: "notSelected" } as const;
        }

        const state = opened ? (estimation ? "result" : "notSelected") : estimation ? "estimated" : "notSelected";

        let displayValue: string = "?";

        if (UserEstimation.isEstimated(estimation)) {
          displayValue = Card.toString(estimation.card);
        }

        return { userName: user.name, userMode: mode, displayValue, state } as const;
      })
      .filter(filterUndefined);

    return Loadable.finished(estimations);
  }
);
