import { createSlice } from "@reduxjs/toolkit";
import {
  signIn,
  signInFailure,
  signInSuccess,
  signUp,
  signUpFailure,
  signUpSuccess,
  tryAuthenticate,
  tryAuthenticateFailure,
  tryAuthenticateSuccess,
} from "../actions/signin";

type AuthenticationProgress = "unauthenticated" | "tryAuthenticate" | "signIn" | "signUp" | "authenticated" | "failed";

interface AuthState {
  progress: AuthenticationProgress;
  authenticating: boolean;
}

const initialState = {
  progress: "unauthenticated",
  authenticating: false,
} as AuthState satisfies AuthState;

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // use builder to add reducer

    builder.addCase(tryAuthenticate, (draft) => {
      if (draft.progress === "unauthenticated") {
        draft.progress = "tryAuthenticate";
        draft.authenticating = true;
      }
    });

    builder.addCase(tryAuthenticateSuccess, (draft) => {
      if (draft.progress === "tryAuthenticate") {
        draft.progress = "authenticated";
        draft.authenticating = false;
      }
    });

    builder.addCase(tryAuthenticateFailure, (draft) => {
      if (draft.progress === "tryAuthenticate") {
        draft.progress = "failed";
        draft.authenticating = false;
      }
    });

    builder.addCase(signIn, (draft) => {
      if (draft.progress === "unauthenticated" || draft.progress === "failed") {
        draft.progress = "signIn";
        draft.authenticating = true;
      }
    });

    builder.addCase(signInSuccess, (draft) => {
      if (draft.progress === "signIn") {
        draft.progress = "authenticated";
        draft.authenticating = false;
      }
    });

    builder.addCase(signInFailure, (draft) => {
      if (draft.progress === "signIn") {
        draft.progress = "failed";
        draft.authenticating = false;
      }
    });

    builder.addCase(signUp, (draft) => {
      if (draft.progress === "unauthenticated" || draft.progress === "failed") {
        draft.progress = "signUp";
        draft.authenticating = true;
      }
    });

    builder.addCase(signUpSuccess, (draft) => {
      if (draft.progress === "signUp") {
        draft.progress = "authenticated";
        draft.authenticating = false;
      }
    });

    builder.addCase(signUpFailure, (draft) => {
      if (draft.progress === "signUp") {
        draft.progress = "failed";
        draft.authenticating = false;
      }
    });
  },
});

export const getInitialState = slice.getInitialState;
export const reducer = slice.reducer;
