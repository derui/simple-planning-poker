import { createAction } from "@reduxjs/toolkit";
import { SomethingFailure } from "./common";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import { JoinedGameState } from "@/domains/game-repository";

const prefix = "signin";

export interface AuthenticationSuccess {
  user: User.T;
  joinedGames?: Record<Game.Id, { name: string; state: JoinedGameState }>;
}

// try to authenticate with stored credential if it exists
export const tryAuthenticate = createAction(`${prefix}:tryAuthenticate`);
export const tryAuthenticateSuccess = createAction<AuthenticationSuccess>(`${prefix}:tryAuthenticateSuccess`);
export const tryAuthenticateFailure = createAction<SomethingFailure>(`${prefix}:tryAuthenticateFailure`);

// sign in with email and password
export const signIn = createAction<{ email: string; password: string }>(`${prefix}:signIn`);
export const signInSuccess = createAction<AuthenticationSuccess>(`${prefix}:singInSuccessd`);
export const signInFailure = createAction<SomethingFailure>(`${prefix}:signInFailure`);

// sign up with email and password
export const signUp = createAction<{ email: string; password: string }>(`${prefix}:signUp`);
export const signUpSuccess = createAction<AuthenticationSuccess>(`${prefix}:signUpSuccess`);
export const signUpFailure = createAction<SomethingFailure>(`${prefix}:signUpFailure`);

// common failure to user observing
export const observingFailure = createAction<SomethingFailure>(`${prefix}:observingFailure`);
