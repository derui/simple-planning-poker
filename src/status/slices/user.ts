import { createSlice } from "@reduxjs/toolkit";
import { signInSuccess, signUpSuccess, tryAuthenticateSuccess } from "../actions/signin";
import { changeNameSuccess, notifyOtherUserChanged } from "../actions/user";
import * as User from "@/domains/user";

interface UserState {
  users: { [k: User.Id]: User.T };
  currentUser: User.T | null;
}

const initialState = {
  currentUser: null,
  users: {},
} as UserState satisfies UserState;

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // use builder to add reducer

    builder.addCase(tryAuthenticateSuccess, (draft, { payload }) => {
      draft.currentUser = payload;
      draft.users[payload.id] = payload;
    });

    builder.addCase(signInSuccess, (draft, { payload }) => {
      draft.currentUser = payload;
      draft.users[payload.id] = payload;
    });

    builder.addCase(signUpSuccess, (draft, { payload }) => {
      draft.currentUser = payload;
      draft.users[payload.id] = payload;
    });

    builder.addCase(notifyOtherUserChanged, (draft, { payload }) => {
      draft.users[payload.id] = payload;
    });

    builder.addCase(changeNameSuccess, (draft, { payload }) => {
      if (draft.currentUser === null) {
        return;
      }
      draft.currentUser = payload;
      draft.users[payload.id] = payload;
    });
  },
});

export const getInitialState = slice.getInitialState;
export const reducer = slice.reducer;
