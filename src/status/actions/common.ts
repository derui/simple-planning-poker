import { createAction } from "@reduxjs/toolkit";

/**
 * noop action to through event on observable. DO NOT HANDLE THIS ACTION IN SLICE OR EPIC.
 */
export const noopOnEpic = createAction("noop");
