import { signInState } from "@/status/signin/signals/signin-state";
import { createMemo } from "solid-js";

const locationToNavigateState = () => createMemo(() => signInState().locationToNavigate);

export { locationToNavigateState };
