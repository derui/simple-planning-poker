import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserMode } from "@/domains/game-player";
import * as UserHand from "@/domains/user-hand";
import * as Card from "@/domains/card";
import * as User from "@/domains/user";
import { filterUndefined } from "@/utils/basic";
import * as Loadable from "@/utils/loadable";

const selectSelf = (state: RootState) => state;
const selectRound = createDraftSafeSelector(selectSelf, (state) => state.round);
const selectRoundInstance = createDraftSafeSelector(selectRound, (state) => state.instance);
const selectUser = createDraftSafeSelector(selectSelf, (state) => state.user);
const selectUsers = createDraftSafeSelector(selectUser, (state) => state.users);

export type UserHandState = "notSelected" | "handed" | "result";

export interface UserHandInfo {
  userName: string;
  userMode: UserMode;
  displayValue: string;
  state: UserHandState;
}

/**
 * return UserInfo in current game with current user
 */
export const selectUserHandInfos = function selectUserHandInfos() {
  return createDraftSafeSelector(selectRoundInstance, selectUsers, (round, users): Loadable.T<UserHandInfo[]> => {
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

        const state = opened ? (hand ? "result" : "notSelected") : hand ? "handed" : "notSelected";

        let displayValue: string = "?";

        if (UserHand.isHanded(hand)) {
          displayValue = Card.toString(hand.card);
        } else if (UserHand.isGiveUp(hand)) {
          displayValue = "?";
        }

        if (displayValue) return { userName: user.name, userMode: mode, displayValue, state } as const;
      })
      .filter(filterUndefined);

    return Loadable.finished(hands);
  });
};
