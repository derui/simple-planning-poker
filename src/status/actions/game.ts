import { createAction } from "@reduxjs/toolkit";
import * as Game from "@/domains/game";
import * as Invitation from "@/domains/invitation";

const prefix = "gamePlayer";

// give up the game
export const giveUp = createAction(`${prefix}:giveUp`);
export const giveUpSuccess = createAction<Game.T>(`${prefix}:giveUpSuccess`);

// hand card
export const handCard = createAction<{ cardIndex: number }>(`${prefix}:handCard`);
export const handCardSuccess = createAction<Game.T>(`${prefix}:handCardSuccess`);

// change user mode
export const changeToInspector = createAction(`${prefix}:changeToInspector`);
export const changeToInspectorSuccess = createAction<Game.T>(`${prefix}:changeToInspectorSuccess`);

export const changeToNormalPlayer = createAction(`${prefix}:changeToNormalPlayer`);
export const changeToNormalPlayerSuccess = createAction<Game.T>(`${prefix}:changeToNormalPlayerSuccess`);

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
export const openGameSuccess = createAction<Game.T>(`${prefix}:openGameSuccess`);
export const openGameFailure = createAction<{ reason: string }>(`${prefix}:openGameFailure`);