import { createSignal } from "solid-js";

interface Signal {
  authenticating: boolean;
  authenticated: boolean;
  locationToNavigate: string;
}

const [signInState, setSignInState] = createSignal<Signal>({
  authenticating: false,
  authenticated: false,
  locationToNavigate: "/",
});

export { signInState, setSignInState };
