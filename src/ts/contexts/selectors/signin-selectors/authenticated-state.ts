import { signInState } from "@/status/signin/signals/signin-state";
import { createMemo } from "solid-js";

const authenticatedState = () => createMemo(() => signInState().authenticated);

export { authenticatedState };
