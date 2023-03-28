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

// notify round update(private action. DO NOT DISPATCH THESE ACTIONS FROM COMPONENTS)
export const notifyRoundUpdated = createAction<Round.T>(`${prefix}:notifyRoundUpdated`);
