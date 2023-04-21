import { createAction } from "@reduxjs/toolkit";
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
export const openFinishedRounds = createAction(`${prefix}:openFinishedRounds`);
export const openFinishedRoundsSuccess = createAction<Round.FinishedRound[]>(`${prefix}:openFinishedRoundsSuccess`);

// change page of finished rounds
export const changePageOfFinishedRounds = createAction<number>(`${prefix}:changePageOfFinishedRounds`);
export const changePageOfFinishedRoundsSuccess = createAction<{ page: number; rounds: Round.FinishedRound[] }>(
  `${prefix}:changePageOfFinishedRoundsSuccess`
);

// close finished rounds
export const closeFinishedRounds = createAction(`${prefix}:closeFinishedRounds`);
export const closeFinishedRoundsSuccess = createAction(`${prefix}:closeFinishedRoundsSuccess`);

// notify round update(private action. DO NOT DISPATCH THESE ACTIONS FROM COMPONENTS)
export const notifyRoundUpdated = createAction<Round.T>(`${prefix}:notifyRoundUpdated`);
