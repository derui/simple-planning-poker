import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as User from "@/domains/user";
import * as UserEstimation from "@/domains/user-estimation";
import * as Card from "@/domains/card";
import * as Loadable from "@/utils/loadable";
import { filterUndefined } from "@/utils/basic";
import { UserMode } from "@/domains/game-player";

const selectSelf = (state: RootState) => state;
const selectFinishedRounds = createDraftSafeSelector(selectSelf, (state) => state.finishedRounds);
const selectCurrentRoundHistory = createDraftSafeSelector(selectFinishedRounds, (state) => state.currentRound);
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

export interface RoundHistoryInfo {
  theme: string;
  finishedAt: string;
  id: string;
  results: {
    cardCounts: { point: number; count: number }[];
    averagePoint: number;
  };
  estimations: UserEstimationInfo[];
}

export interface RoundHistoriesInfo {
  histories: { id: string; theme: string; finishedAt: string; averagePoint: number }[];
}

/**
 * select top page or not
 */
export const selectTopPage = createDraftSafeSelector(selectFinishedRounds, (rounds): boolean => {
  return rounds.page === 1;
});

export const selectRoundHistories = createDraftSafeSelector(
  selectFinishedRounds,
  (rounds): Loadable.T<RoundHistoriesInfo> => {
    if (rounds.state !== "fetched") {
      return Loadable.loading();
    }

    const _rounds = Object.values(rounds.rounds)
      .map((round) => {
        return {
          id: round.id,
          theme: round.theme || "",
          finishedAt: round.finishedAt,
          averagePoint: round.averagePoint,
        };
      })
      .sort((o1, o2) => {
        return o2.finishedAt.localeCompare(o1.finishedAt);
      });

    return Loadable.finished({ histories: _rounds });
  }
);

/**
 * return UserInfo in current game with current user
 */
export const selectOpenedRoundHistory = createDraftSafeSelector(
  selectCurrentRoundHistory,
  selectUsers,
  selectGame,
  (round, users, { currentGame: game }): Loadable.T<RoundHistoryInfo> => {
    if (!round || !game) {
      return Loadable.loading();
    }

    const cardCounts = new Map<number, number>();
    const estimations = Object.entries(round.estimations)
      .map(([userId, estimation]) => {
        const user = users[userId as User.Id];
        const player = game.joinedPlayers.find((v) => v.user === (userId as User.Id));

        const state = estimation ? "result" : "notSelected";

        let displayValue: string = "?";

        if (UserEstimation.isEstimated(estimation)) {
          displayValue = Card.toString(estimation.card);
          cardCounts.set(estimation.card, cardCounts.get(estimation.card) ?? 1);
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
      finishedAt: round.finishedAt,
      results: {
        averagePoint: round.averagePoint,
        cardCounts: Array.from(cardCounts.entries())
          .sort(([v1], [v2]) => v1 - v2)
          .map(([point, count]) => ({ point, count })),
      },
      estimations,
    });
  }
);
