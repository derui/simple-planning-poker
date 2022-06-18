import { createMemo } from "solid-js";
import { signInState } from "../signals/signin-state";

const authenticatedState = createMemo(() => signInState().authenticated);

export { authenticatedState };
