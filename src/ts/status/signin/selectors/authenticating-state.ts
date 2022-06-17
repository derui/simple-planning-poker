import { createMemo } from "solid-js";
import { signInState } from "../atoms/signin-state";

const authenticatingState = createMemo(() => signInState().authenticating);

export { authenticatingState };
