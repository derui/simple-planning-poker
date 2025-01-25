import { useAtomValue, useSetAtom } from "jotai";

import { loginErrorAtom, loginStatusAtom, signInAtom, signUpAtom } from "./atom.js";

/**
 * Hook to login
 */
export type UseLogin = () => {
  /**
   * sign in existance user
   */
  signIn: (email: string, password: string) => void;

  /**
   * sign up new user
   */
  signUp: (email: string, password: string) => void;

  /**
   * Login status
   */
  readonly status: "logined" | "notLogined" | "doing";

  /**
   * Set error message when login failed
   */
  readonly loginError: string | undefined;
};

/**
 * Factory function to create `useLogin` hook
 */
export const useLogin: UseLogin = () => {
  const status = useAtomValue(loginStatusAtom);
  const loginError = useAtomValue(loginErrorAtom);
  const signIn = useSetAtom(signInAtom);
  const signUp = useSetAtom(signUpAtom);

  return {
    signIn,
    signUp,
    status,
    loginError,
  };
};
