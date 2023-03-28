import { createAction } from "@reduxjs/toolkit";
import { SomethingFailure } from "./common";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import { JoinedGameState } from "@/domains/game-repository";

const prefix = "user";

export const changeName = createAction<string>(`${prefix}:changeName`);
export const changeNameSuccess = createAction<User.T>(`${prefix}:changeNameSuccess`);
export const changeNameFailure = createAction<SomethingFailure>(`${prefix}:changeNameFailure`);

// get other user information
export const notifyOtherUserChanged = createAction<User.T>(`${prefix}:notifyOtherUseChanged`);

/**
 * notify changes of joined games of current user
 */
export const notifyJoinedGames = createAction<{ user: User.Id; games: { id: Game.Id; state: JoinedGameState }[] }>(
  `${prefix}:notifyJoinedGames`
);
