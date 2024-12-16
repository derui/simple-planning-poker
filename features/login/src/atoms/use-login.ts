import { Authenticator } from "@spp/infra-authenticator/base";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { useLoginUser } from "./use-login-user.js";

/**
 * Login status
 */
enum LoginStatus {
  Logined = "logined",
  NotLogined = "notLogined",
  Doing = "doing",
}

/**
 * Atom for login status
 */
const loginStatusAtom = atom<LoginStatus>(LoginStatus.NotLogined);
const loginErrorAtom = atom<string | undefined>();

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
  const { loginUser } = useLoginUser();
  const [status, setStatus] = useAtom(loginStatusAtom);
  const [loginError, setLoginError] = useAtom(loginErrorAtom);
  const signIn = useCallback(
    (email: string, password: string) => {
      setStatus(LoginStatus.Doing);

      Authenticator.signIn({ email, password })
        .then((userId) => {
          if (userId) {
            loginUser(userId);
            setStatus(LoginStatus.Logined);
          } else {
            setStatus(LoginStatus.NotLogined);
            setLoginError("Email or password is invalid");
          }
        })
        .catch(() => {
          setStatus(LoginStatus.NotLogined);
          setLoginError("Error occurred on backend. Please retry later");
        });
    },
    [setLoginError, setStatus]
  );

  const signUp = useCallback(
    (email: string, password: string) => {
      setStatus(LoginStatus.Doing);

      Authenticator.signUp({ name: email, email, password })
        .then((userId) => {
          if (userId) {
            loginUser(userId);
            setStatus(LoginStatus.Logined);
          } else {
            setStatus(LoginStatus.NotLogined);
            setLoginError("Email or password is invalid");
          }
        })
        .catch(() => {
          setStatus(LoginStatus.NotLogined);
          setLoginError("Error occurred on backend. Please retry later");
        });
    },
    [setLoginError, setStatus]
  );

  return {
    signIn,
    signUp,

    status,
    loginError,
  };
};
