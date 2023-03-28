import { AnyAction, createSlice } from "@reduxjs/toolkit";
import { v4 } from "uuid";
import { clearError, SomethingFailure } from "../actions/common";

interface ErrorState {
  errors: Record<string, string>;
}

const initialState = {
  errors: {},
} as ErrorState;

const slice = createSlice({
  name: "error",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(clearError, (draft, action) => {
      if (draft.errors[action.payload]) {
        delete draft.errors[action.payload];
      }
    });

    builder.addMatcher(
      (action) => action.type.match(/.*Failure$/),
      (draft, action: AnyAction) => {
        draft.errors[v4()] = (action.payload as SomethingFailure).reason;
      }
    );
  },
});

export const getInitialState = slice.getInitialState;
export const reducer = slice.reducer;
