import { createContext, useContext } from "solid-js";
import { authenticatedState } from "./authenticated-state";
import { authenticatingState } from "./authenticating-state";

interface Context {
  authenticated: ReturnType<typeof authenticatedState>;
  authenticating: ReturnType<typeof authenticatingState>;
}

export const SignInSelectorsContext = createContext<Context>({} as any);

export const useSignInSelectors = () => useContext(SignInSelectorsContext);

/**
   initialize context via selectors
 */
export const initSignInSelectorsContext = function (): Context {
  return {
    authenticated: authenticatedState(),
    authenticating: authenticatingState(),
  };
};
