import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Loading } from "@/type";
import { UserMode } from "@/domains/game-player";
import * as UserHand from "@/domains/user-hand";
import * as Card from "@/domains/card";
import { filterUndefined } from "@/utils/basic";

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
  return createDraftSafeSelector(
    [selectGame, selectUser],
    ({ currentGame }, { users }): [UserHandInfo[] | undefined, Loading] => {
      if (!currentGame) {
        return [undefined, "loading"];
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

      return [hands, "finished"];
    }
  );
};
