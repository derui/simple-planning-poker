import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

// define and export selector function.
const selectSelf = (state: RootState) => state;
const selectErrors = createDraftSafeSelector(selectSelf, (state) => state.error.errors);

export interface ErrorMessage {
  id: string;
  type: "alert" | "info" | "warning";
  content: string;
}

/**
 * select error messages
 */
export const selectErrorMessages = createDraftSafeSelector(selectErrors, (errors): ErrorMessage[] => {
  return Object.entries(errors).map(([k, v]) => {
    return {
      id: k,
      type: v.type,
      content: v.content,
    };
  });
});
