import { createAction } from "@reduxjs/toolkit";
import * as Game from "@/domains/game";
import * as Invitation from "@/domains/invitation";
import * as User from "@/domains/user";
import { UserMode } from "@/domains/game-player";

const prefix = "gamePlayer";

// common failure.
export const somethingFailure = createAction<string>(`${prefix}:somethingFailure`);

// give up the game
export const giveUp = createAction(`${prefix}:giveUp`);
export const giveUpSuccess = createAction<Game.T>(`${prefix}:giveUpSuccess`);

// hand card
export const handCard = createAction<{ cardIndex: number }>(`${prefix}:handCard`);
export const handCardSuccess = createAction<Game.T>(`${prefix}:handCardSuccess`);

// change user mode
export const changeUserMode = createAction<UserMode>(`${prefix}:changeUserMode`);
export const changeUserModeSuccess = createAction<Game.T>(`${prefix}:changeUserModeSuccess`);

// notify game update
export const notifyGameChanges = createAction<Game.T>(`${prefix}:notifyGamenChanges`);

// leave from game
export const leaveGame = createAction(`${prefix}:leaveGame`);
export const leaveGameSuccess = createAction(`${prefix}:leaveGameSuccess`);

// join to the game.
export const joinGame = createAction<Invitation.T>(`${prefix}:joinGame`);
export const joinGameSuccess = createAction<Game.T>(`${prefix}:joinGameSuccess`);
export const joinGameFailure = createAction<{ reason: string }>(`${prefix}:joinGameFailure`);

// select game user already joined
export const openGame = createAction<Game.Id>(`${prefix}:openGame`);
export const openGameSuccess = createAction<{ game: Game.T; players: User.T[] }>(`${prefix}:openGameSuccess`);
export const openGameFailure = createAction<{ reason: string }>(`${prefix}:openGameFailure`);

// create game
export const createGame = createAction<{ name: string; points: number[] }>(`${prefix}:createGame`);
export const createGameSuccess = createAction<Game.T>(`${prefix}:createGameSuccess`);
export const createGameFailure = createAction<{ reason: string }>(`${prefix}:createGameFailure`);

// new round
export const newRound = createAction(`${prefix}:newRound`);
export const newRoundSuccess = createAction<Game.T>(`${prefix}:newRoundSuccess`);
export const newRoundFailure = createAction<{ reason: string }>(`${prefix}:newRoundFailure`);

// new round
export const showDown = createAction(`${prefix}:showDown`);
export const showDownSuccess = createAction<Game.T>(`${prefix}:showDownSuccess`);
export const showDownFailed = createAction<{ reason: string }>(`${prefix}:showDownFailed`);
