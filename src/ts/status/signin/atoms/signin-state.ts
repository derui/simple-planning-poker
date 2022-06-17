import { createSignal } from "solid-js";

const [signInState, setSignInState] = createSignal<{ authenticating: boolean; authenticated: boolean }>({
  authenticating: false,
  authenticated: false,
});

export { signInState, setSignInState };
