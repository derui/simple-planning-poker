import { createSlice } from "@reduxjs/toolkit";
import { signInSuccess, signUpSuccess, tryAuthenticateSuccess } from "../actions/signin";
import { changeNameSuccess, notifyOtherUserChanged } from "../actions/user";
import { createGameSuccess, openGameSuccess } from "../actions/game";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import { JoinedGameState } from "@/domains/game-repository";

interface UserState {
  users: { [k: User.Id]: User.T };
  currentUser: User.T | null;
  currentUserJoinedGames: Record<Game.Id, { name: string; state: JoinedGameState }>;
}

const initialState = {
  currentUser: null,
  users: {},
  currentUserJoinedGames: {},
} as UserState satisfies UserState;

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // use builder to add reducer

    builder.addCase(tryAuthenticateSuccess, (draft, { payload }) => {
      draft.currentUser = payload.user;
      draft.currentUserJoinedGames = payload.joinedGames ?? {};
      draft.users[payload.user.id] = payload.user;
    });

    builder.addCase(signInSuccess, (draft, { payload }) => {
      draft.currentUser = payload.user;
      draft.currentUserJoinedGames = payload.joinedGames ?? {};
      draft.users[payload.user.id] = payload.user;
    });

    builder.addCase(signUpSuccess, (draft, { payload }) => {
      draft.currentUser = payload.user;
      draft.currentUserJoinedGames = payload.joinedGames ?? {};
      draft.users[payload.user.id] = payload.user;
    });

    builder.addCase(notifyOtherUserChanged, (draft, { payload }) => {
      draft.users[payload.id] = payload;

      if (payload.id === draft.currentUser?.id) {
        draft.currentUser = payload;
      }
    });

    builder.addCase(createGameSuccess, (draft, { payload }) => {
      draft.currentUserJoinedGames[payload.id] = { name: payload.name, state: JoinedGameState.joined };
    });

    builder.addCase(changeNameSuccess, (draft, { payload }) => {
      if (draft.currentUser === null) {
        return;
      }
      draft.currentUser = payload;
      draft.users[payload.id] = payload;
    });

    builder.addCase(openGameSuccess, (draft, { payload }) => {
      for (let player of payload.players) {
        draft.users[player.id] = player;
      }
    });
  },
});

export const getInitialState = slice.getInitialState;
export const reducer = slice.reducer;
