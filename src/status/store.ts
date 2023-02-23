import { Action, configureStore } from "@reduxjs/toolkit";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import type { Dependencies } from "@/dependencies";
import { DependencyRegistrar } from "@/utils/dependency-registrar";

// INJECT REDUCER IMPORT HERE
import * as auth from "./slices/auth";

import * as user from "./slices/user";

// INJECT EPIC IMPORT HERE

const reducers = {
  auth: auth.reducer,

  user: user.reducer,

  // do not format this structure.
} as const;

// eslint-disable-next-line
export const createStore = (registrar: DependencyRegistrar<Dependencies>) => {
  const rootEpics = [
    // do not format this structure.
  ];

  // eslint-disable-next-line
  const epicMiddleware = createEpicMiddleware<Action, Action, any>();

  const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(epicMiddleware),
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
