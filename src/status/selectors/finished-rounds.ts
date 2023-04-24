import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as Round from "@/domains/round";
import * as User from "@/domains/user";
import * as UserEstimation from "@/domains/user-estimation";
import * as Card from "@/domains/card";
import * as Loadable from "@/utils/loadable";
import { filterUndefined } from "@/utils/basic";
import { UserMode } from "@/domains/game-player";

const selectSelf = (state: RootState) => state;
const selectFinishedRounds = createDraftSafeSelector(selectSelf, (state) => state.finishedRounds);
const selectGame = createDraftSafeSelector(selectSelf, (state) => state.game);
const selectUser = createDraftSafeSelector(selectSelf, (state) => state.user);
const selectUsers = createDraftSafeSelector(selectUser, (state) => state.users);

type UserEstimationState = "notSelected" | "result";

interface UserEstimationInfo {
  userName: string;
  userMode: UserMode;
  displayValue: string;
  state: UserEstimationState;
}

export interface FinishedRoundInfo {
  theme: string;
  finishedAt: Date;
  id: string;
  averagePoint: number;
  estimations: UserEstimationInfo[];
}

export const selectFinishedRoundList = createDraftSafeSelector(
  selectFinishedRounds,
  (rounds): Loadable.T<FinishedRoundInfo[]> => {
    if (rounds.state !== "fetched") {
      return Loadable.loading();
    }

    const _rounds = Object.values(rounds.rounds)
      .map((round) => {
        return {
          id: round.id,
          theme: round.theme || "",
          finishedAt: new Date(round.finishedAt),
          averagePoint: round.averagePoint,
          estimations: [],
        };
      })
      .sort((o1, o2) => {
        return o2.finishedAt.getTime() - o1.finishedAt.getTime();
      });

    return Loadable.finished(_rounds);
  }
);

/**
 * return UserInfo in current game with current user
 */
export const selectFinishedRoundInfo = (id: Round.Id) => {
  return createDraftSafeSelector(
    selectFinishedRounds,
    selectUsers,
    selectGame,
    (rounds, users, { currentGame: game }): Loadable.T<FinishedRoundInfo> => {
      const round = rounds.rounds[id];
      if (!round || !game) {
        return Loadable.loading();
      }

      const estimations = Object.entries(round.estimations)
        .map(([userId, estimation]) => {
          const user = users[userId as User.Id];
          const player = game.joinedPlayers.find((v) => v.user === (userId as User.Id));

          const state = estimation ? "result" : "notSelected";

          let displayValue: string = "?";

          if (UserEstimation.isEstimated(estimation)) {
            displayValue = Card.toString(estimation.card);
          }

          return {
            userName: user?.name ?? "unknown",
            userMode: player?.mode ?? UserMode.normal,
            displayValue,
            state,
          } as const;
        })
        .filter(filterUndefined);

      return Loadable.finished({
        id: round.id,
        theme: round.theme || "",
        finishedAt: new Date(round.finishedAt),
        averagePoint: round.averagePoint,
        estimations,
      });
    }
  );
};
