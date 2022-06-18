import { createMemo } from "solid-js";
import { signInState } from "../signals/signin-state";

const authenticatingState = createMemo(() => signInState().authenticating);

export { authenticatingState };
