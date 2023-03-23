import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const selectSelf = (state: RootState) => state;
const selectAuth = createDraftSafeSelector(selectSelf, (state) => state.auth);

/**
 * get authentication progressing or not
 */
export const selectAuthenticating = createDraftSafeSelector(selectAuth, (auth): boolean => {
  return auth.authenticating;
});

export const selectAuthenticated = createDraftSafeSelector(selectAuth, (auth) => {
  return auth.progress === "authenticated";
});
