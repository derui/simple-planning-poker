import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserMode } from "@/domains/game-player";
import * as UserEstimation from "@/domains/user-estimation";
import * as Card from "@/domains/card";
import * as User from "@/domains/user";
import { filterUndefined } from "@/utils/basic";
import * as Loadable from "@/utils/loadable";

const selectSelf = (state: RootState) => state;
const selectRound = createDraftSafeSelector(selectSelf, (state) => state.round);
const selectRoundInstance = createDraftSafeSelector(selectRound, (state) => state.instance);
const selectUser = createDraftSafeSelector(selectSelf, (state) => state.user);
const selectUsers = createDraftSafeSelector(selectUser, (state) => state.users);

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
  (round, users): Loadable.T<UserEstimationInfo[]> => {
    if (!round) {
      return Loadable.loading();
    }

    const opened = round.state === "Finished";

    const hands = Object.entries(round.joinedPlayers)
      .map(([userId, mode]) => {
        const user = users[userId as User.Id];

        if (!user) return;

        const hand = round.hands[user.id];
        if (!hand) {
          return { userName: user.name, userMode: mode, displayValue: "?", state: "notSelected" } as const;
        }

        const state = opened ? (hand ? "result" : "notSelected") : hand ? "estimated" : "notSelected";

        let displayValue: string = "?";

        if (UserEstimation.isEstimated(hand)) {
          displayValue = Card.toString(hand.card);
        } else if (UserEstimation.isGiveUp(hand)) {
          displayValue = "?";
        }

        if (displayValue) return { userName: user.name, userMode: mode, displayValue, state } as const;
      })
      .filter(filterUndefined);

    return Loadable.finished(hands);
  }
);
