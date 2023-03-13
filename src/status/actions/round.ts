import { createAction } from "@reduxjs/toolkit";
import * as Round from "@/domains/round";
import { UserMode } from "@/domains/game-player";

const prefix = "round";

// common failure.
export const somethingFailure = createAction<string>(`${prefix}:somethingFailure`);

// give up the game
export const giveUp = createAction(`${prefix}:giveUp`);
export const giveUpSuccess = createAction<Round.T>(`${prefix}:giveUpSuccess`);

// hand card
export const handCard = createAction<{ cardIndex: number }>(`${prefix}:handCard`);
export const handCardSuccess = createAction<Round.T>(`${prefix}:handCardSuccess`);

// change user mode
export const changeUserMode = createAction<UserMode>(`${prefix}:changeUserMode`);
export const changeUserModeSuccess = createAction<Round.T>(`${prefix}:changeUserModeSuccess`);

// new round
export const showDown = createAction(`${prefix}:showDown`);
export const showDownSuccess = createAction<Round.T>(`${prefix}:showDownSuccess`);
export const showDownFailed = createAction<{ reason: string }>(`${prefix}:showDownFailed`);

// notify round update(private action. DO NOT DISPATCH THESE ACTIONS FROM COMPONENTS)
export const notifyRoundUpdated = createAction<Round.T>(`${prefix}:notifyRoundUpdated`);
