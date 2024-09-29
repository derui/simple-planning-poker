import { createAction } from "@reduxjs/toolkit";
import * as RoundHistory from "../query-models/round-history";
import { SomethingFailure } from "./common";
import * as Round from "@/domains/round";

const prefix = "round";

// common failure.
export const somethingFailure = createAction<SomethingFailure>(`${prefix}:somethingFailure`);

// give up the game
export const giveUp = createAction(`${prefix}:giveUp`);
export const giveUpSuccess = createAction<Round.T>(`${prefix}:giveUpSuccess`);

// estimate
export const estimate = createAction<{ cardIndex: number }>(`${prefix}:estimate`);
export const estimateSuccess = createAction<Round.T>(`${prefix}:estimateSuccess`);

// new round
export const showDown = createAction(`${prefix}:showDown`);
export const showDownSuccess = createAction<Round.T>(`${prefix}:showDownSuccess`);
export const showDownFailed = createAction<SomethingFailure>(`${prefix}:showDownFailed`);

// change theme
export const changeTheme = createAction<string>(`${prefix}:changeTheme`);
export const changeThemeSuccess = createAction<Round.T>(`${prefix}:changeThemeSuccess`);

// open finished rounds
export const openRoundHistories = createAction(`${prefix}:openRoundHistories`);
export const openRoundHistoriesSuccess = createAction<{ rounds: RoundHistory.T[]; lastKey: string }>(
  `${prefix}:openRoundHistoriesSuccess`
);

// change page of finished rounds
export const nextPageOfRoundHistories = createAction(`${prefix}:nextPageOfRoundHistories`);
export const nextPageOfRoundHistoriesSuccess = createAction<{ lastKey: string; rounds: RoundHistory.T[] }>(
  `${prefix}:nextPageOfRoundHistoriesSuccess`
);

// reset page of finished rounds
export const resetPageOfRoundHistories = createAction(`${prefix}:resetPageOfRoundHistories`);
export const resetPageOfRoundHistoriesSuccess = createAction<{ lastKey: string; rounds: RoundHistory.T[] }>(
  `${prefix}:resetPageOfRoundHistoriesSuccess`
);

// open a round history
export const openRoundHistory = createAction<string>(`${prefix}:openRoundHistory`);
export const openRoundHistorySuccess = createAction<Round.FinishedRound>(`${prefix}:openRoundHistorySuccess`);

// close finished rounds
export const closeRoundHistories = createAction(`${prefix}:closeRoundHistories`);

// notify round update(private action. DO NOT DISPATCH THESE ACTIONS FROM COMPONENTS)
export const notifyRoundUpdated = createAction<Round.T>(`${prefix}:notifyRoundUpdated`);
