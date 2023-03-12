import { createAction } from "@reduxjs/toolkit";
import * as Game from "@/domains/game";
import * as Invitation from "@/domains/invitation";
import * as User from "@/domains/user";

const prefix = "game";

export interface OpenedGamePayload {
  game: Game.T;
  players: User.T[];
}

// common failure.
export const somethingFailure = createAction<string>(`${prefix}:somethingFailure`);

// notify game update
export const notifyGameChanges = createAction<Game.T>(`${prefix}:notifyGamenChanges`);

// leave from game
export const leaveGame = createAction(`${prefix}:leaveGame`);
export const leaveGameSuccess = createAction(`${prefix}:leaveGameSuccess`);

// join to the game.
export const joinGame = createAction<Invitation.T>(`${prefix}:joinGame`);
export const joinGameFailure = createAction<{ reason: string }>(`${prefix}:joinGameFailure`);

// select game user already joined
export const openGame = createAction<Game.Id>(`${prefix}:openGame`);
export const openGameSuccess = createAction<OpenedGamePayload>(`${prefix}:openGameSuccess`);
export const openGameFailure = createAction<{ reason: string }>(`${prefix}:openGameFailure`);

// create game
export const initializeCreatingGame = createAction(`${prefix}:initializeCreatingGame`);
export const createGame = createAction<{ name: string; points: number[] }>(`${prefix}:createGame`);
export const createGameSuccess = createAction<Game.T>(`${prefix}:createGameSuccess`);
export const createGameFailure = createAction<{ reason: string }>(`${prefix}:createGameFailure`);

// new round
export const newRound = createAction(`${prefix}:newRound`);
export const newRoundSuccess = createAction<Game.T>(`${prefix}:newRoundSuccess`);
export const newRoundFailure = createAction<{ reason: string }>(`${prefix}:newRoundFailure`);
