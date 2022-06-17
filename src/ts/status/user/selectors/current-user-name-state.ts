import { createMemo } from "solid-js";
import { currentUserState } from "../atoms/current-user-state";

const currentUserNameState = createMemo(() => currentUserState().name);

export { currentUserNameState };
