import { createAction } from "@reduxjs/toolkit";
import * as GamePlayer from "@/domains/game-player";
import * as Game from "@/domains/game";
import * as Invitation from "@/domains/invitation";

const prefix = "gamePlayer";

// give up the game
export const giveUp = createAction(`${prefix}:giveUp`);
export const giveUpSuccess = createAction<GamePlayer.T>(`${prefix}:giveUpSuccess`);

// hand card
export const handCard = createAction<{ cardIndex: number }>(`${prefix}:handCard`);
export const handCardSuccess = createAction<GamePlayer.T>(`${prefix}:handCardSuccess`);

// change user mode
export const changeToInspector = createAction(`${prefix}:changeToInspector`);
export const changeToInspectorSuccess = createAction<GamePlayer.T>(`${prefix}:changeToInspectorSuccess`);

export const changeToNormalPlayer = createAction(`${prefix}:changeToNormalPlayer`);
export const changeToNormalPlayerSuccess = createAction<GamePlayer.T>(`${prefix}:changeToNormalPlayerSuccess`);

// leave from game
export const leaveGame = createAction(`${prefix}:leaveGame`);
export const leaveGameSuccess = createAction(`${prefix}:leaveGameSuccess`);

// join to the game. chain of result is same `selectGameSuccess`
export const joinGame = createAction<Invitation.InvitationSignature>(`${prefix}:joinGame`);

// select game user already joined
export const openGame = createAction<Game.Id>(`${prefix}:openGame`);
export const openGameSuccess = createAction<{ game: Game.T; player: GamePlayer.T; otherPlayers: GamePlayer.T[] }>(
  `${prefix}:openGameSuccess`
);
export const openGameFailure = createAction<{ reason: string }>(`${prefix}:openGameFailure`);
