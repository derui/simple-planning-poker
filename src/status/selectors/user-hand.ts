import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserMode } from "@/domains/game-player";
import * as UserHand from "@/domains/user-hand";
import * as Card from "@/domains/card";
import { filterUndefined } from "@/utils/basic";
import * as Loadable from "@/utils/loadable";

const selectSelf = (state: RootState) => state;
const selectGame = createDraftSafeSelector(selectSelf, (state) => state.game);
const selectUser = createDraftSafeSelector(selectSelf, (state) => state.user);

export interface UserHandInfo {
  userName: string;
  userMode: UserMode;
  displayValue: string;
  selected: boolean;
}

/**
 * return UserInfo in current game with current user
 */
export const selectUserHandInfos = function selectUserHandInfos() {
  return createDraftSafeSelector([selectGame, selectUser], ({ currentGame }, { users }): Loadable.T<UserHandInfo[]> => {
    if (!currentGame) {
      return Loadable.loading();
    }

    const hands = currentGame.joinedPlayers
      .map((v) => {
        const user = users[v.user];

        if (!user) return;

        const hand = currentGame.round.hands[user.id];
        if (!hand) {
          return { userName: user.name, userMode: v.mode, displayValue: "?", selected: false } as const;
        }

        let displayValue: string = "?";

        if (UserHand.isHanded(hand)) {
          displayValue = Card.toString(hand.card);
        } else if (UserHand.isGiveUp(hand)) {
          displayValue = "?";
        }

        if (displayValue) return { userName: user.name, userMode: v.mode, displayValue, selected: true } as const;
      })
      .filter(filterUndefined);

    return Loadable.finished(hands);
  });
};
