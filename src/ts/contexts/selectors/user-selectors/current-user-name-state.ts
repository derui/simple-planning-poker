import { currentUserState } from "@/status/user/signals/current-user-state";
import { createMemo } from "solid-js";

const currentUserNameState = () => createMemo(() => currentUserState().name);

export { currentUserNameState };
