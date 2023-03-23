import { createAction } from "@reduxjs/toolkit";
import * as User from "@/domains/user";

const prefix = "user";

export const changeName = createAction<string>(`${prefix}:changeName`);
export const changeNameSuccess = createAction<User.T>(`${prefix}:changeNameSuccess`);
export const changeNameFailure = createAction(`${prefix}:changeNameFailure`);

// get other user information
export const notifyOtherUserChanged = createAction<User.T>(`${prefix}:notifyOtherUseChanged`);
