import { Action, configureStore } from "@reduxjs/toolkit";
import { combineEpics, createEpicMiddleware } from "redux-observable";

// INJECT REDUCER IMPORT HERE
import * as finishedRounds from "./slices/round-history";

import * as error from "./slices/error";

import * as round from "./slices/round";

import * as game from "./slices/game";

import * as auth from "./slices/auth";

import * as user from "./slices/user";

// INJECT EPIC IMPORT HERE
import { authEpic } from "./epics/auth";

import { gameEpic } from "./epics/game";

import { userEpic } from "./epics/user";
import { roundEpic } from "./epics/round";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import type { Dependencies } from "@/dependencies";

const reducers = {
  finishedRounds: finishedRounds.reducer,

  error: error.reducer,

  round: round.reducer,

  game: game.reducer,

  auth: auth.reducer,

  user: user.reducer,

  // do not format this structure.
} as const;

export const createStore = (registrar: DependencyRegistrar<Dependencies>, production: boolean = false) => {
  const rootEpics = [
    ...Object.values(authEpic(registrar)),

    ...Object.values(gameEpic(registrar)),

    ...Object.values(userEpic(registrar)),

    ...Object.values(roundEpic(registrar)),
    // do not format this structure.
  ];

  // eslint-disable-next-line
  const epicMiddleware = createEpicMiddleware<Action, Action, any>();

  const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(epicMiddleware),
    devTools: !production,
  });

  epicMiddleware.run(combineEpics<Action, Action, RootState>(...rootEpics));

  return store;
};

/**
 * create pure store. This store does not have any epic/thunk based process. To use for test.
 */
export const createPureStore = () => {
  return configureStore({ reducer: reducers });
};

// export type of application state.
export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];
