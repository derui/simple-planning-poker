import { signInState } from "@/status/signin/signals/signin-state";
import { createMemo } from "solid-js";

const authenticatingState = () => createMemo(() => signInState().authenticating);

export { authenticatingState };
