import { createAction } from "@reduxjs/toolkit";
import { SomethingFailure } from "./common";
import * as Game from "@/domains/game";
import * as Round from "@/domains/round";
import * as Invitation from "@/domains/invitation";
import * as User from "@/domains/user";
import { UserMode } from "@/domains/game-player";

const prefix = "game";

export interface OpenedGamePayload {
  game: Game.T;
  players: User.T[];
}

// common failure.
export const somethingFailure = createAction<SomethingFailure>(`${prefix}:somethingFailure`);

// notify game update
export const notifyGameChanges = createAction<Game.T>(`${prefix}:notifyGamenChanges`);

// leave from game
export const leaveGame = createAction(`${prefix}:leaveGame`);
export const leaveGameSuccess = createAction(`${prefix}:leaveGameSuccess`);

// kick player from game
export const kickPlayer = createAction<User.Id>(`${prefix}:kickPlayer`);
export const kickPlayerSuccess = createAction(`${prefix}:kickPlayerSuccess`);

// join to the game.
export const joinGame = createAction<Invitation.T>(`${prefix}:joinGame`);
export const joinGameFailure = createAction<SomethingFailure>(`${prefix}:joinGameFailure`);

// select game user already joined
export const openGame = createAction<Game.Id>(`${prefix}:openGame`);
export const openGameSuccess = createAction<OpenedGamePayload>(`${prefix}:openGameSuccess`);
export const openGameFailure = createAction<SomethingFailure>(`${prefix}:openGameFailure`);

// create game
export const initializeCreatingGame = createAction(`${prefix}:initializeCreatingGame`);
export const createGame = createAction<{ name: string; points: number[] }>(`${prefix}:createGame`);
export const createGameSuccess = createAction<Game.T>(`${prefix}:createGameSuccess`);
export const createGameFailure = createAction<SomethingFailure>(`${prefix}:createGameFailure`);

// change user mode
export const changeUserMode = createAction<UserMode>(`${prefix}:changeUserMode`);
export const changeUserModeSuccess = createAction<Game.T>(`${prefix}:changeUserModeSuccess`);

// new round
export const newRound = createAction(`${prefix}:newRound`);
export const newRoundSuccess = createAction<Round.T>(`${prefix}:newRoundSuccess`);
export const newRoundFailure = createAction<SomethingFailure>(`${prefix}:newRoundFailure`);
