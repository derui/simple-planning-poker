import { createMemo } from "solid-js";
import { currentUserState } from "../signals/current-user-state";

const currentUserNameState = createMemo(() => currentUserState().name);

export { currentUserNameState };
