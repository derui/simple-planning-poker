import { createAction } from "@reduxjs/toolkit";
import * as User from "@/domains/user";

const prefix = "signin";

// try to authenticate with stored credential if it exists
export const tryAuthenticate = createAction(`${prefix}:tryAuthenticate`);
export const tryAuthenticateSuccess = createAction<User.T>(`${prefix}:tryAuthenticateSuccess`);
export const tryAuthenticateFailure = createAction(`${prefix}:tryAuthenticateFailure`);

// sign in with email and password
export const signIn = createAction<{ email: string; password: string }>(`${prefix}:signIn`);
export const signInSuccess = createAction<User.T>(`${prefix}:singInSuccessd`);
export const signInFailure = createAction(`${prefix}:signInFailure`);

// sign up with email and password
export const signUp = createAction<{ email: string; password: string }>(`${prefix}:signUp`);
export const signUpSuccess = createAction<User.T>(`${prefix}:signUpSuccess`);
export const signUpFailure = createAction(`${prefix}:signUpFailure`);
