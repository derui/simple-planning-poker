import { createAction } from "@reduxjs/toolkit";

/**
 * noop action to through event on observable. DO NOT HANDLE THIS ACTION IN SLICE OR EPIC.
 */
export const noopOnEpic = createAction("noop");

/**
 * common error payload
 */
export interface SomethingFailure {
  reason: string;
}

/**
 * clear error that is specified by given id
 */
export const clearError = createAction<string>("clearError");

/**
 * show message as information
 */
export const showMessage = createAction<string>("showMessage");
