import { Authenticator } from "@spp/infra-authenticator";
import { User } from "@spp/shared-domain";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

/**
 * User id that is logined.
 */
const currentUserIdAtom = atom<User.Id | undefined>();

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
 * Authentication status. Not same as login status.
 */
export enum AuthStatus {
  Checking = "checking",
  NotAuthenticated = "notAuthenticated",
  Authenticated = "authenticated",
}

const authStatusAtom = atom<AuthStatus>(AuthStatus.NotAuthenticated);

/**
 * Login user hook
 */
export type UseLoginUser = () => {
  /**
   * Logined user id
   */
  readonly userId: User.Id | undefined;
};

/**
 * Create `UseLoginUser` hook
 */
export const createUseLoginUser = function createUseLoginUser(): UseLoginUser {
  return () => {
    const currentUserId = useAtomValue(currentUserIdAtom);

    return {
      userId: currentUserId,
    };
  };
};

/**
 * Hook interface
 */
export type UseAuth = () => {
  /**
   * logined or not
   */
  readonly status: AuthStatus;

  /**
   * Start checking login or not
   */
  checkLogined: () => void;

  /**
   * Logout user
   */
  logout: () => Promise<void>;
};

/**
 * Hook factory for `useAuth`
 */
export const createUseAuth = function createUseAuth(authenticator: Authenticator): UseAuth {
  return () => {
    const setCurrentUserId = useSetAtom(currentUserIdAtom);
    const [status, setStatus] = useAtom(authStatusAtom);
    const checkLogined = useCallback(() => {
      setStatus(AuthStatus.Checking);

      authenticator
        .currentUserIdIfExists()
        .then((userId) => {
          if (!userId) {
            setStatus(AuthStatus.NotAuthenticated);
          } else {
            setCurrentUserId(userId);
            setStatus(AuthStatus.Authenticated);
          }
        })
        .catch(() => {
          setStatus(AuthStatus.NotAuthenticated);
        });
    }, [setStatus, setCurrentUserId]);

    return {
      status,
      checkLogined,
      logout: () => {
        setCurrentUserId(undefined);
        return Promise.resolve();
      },
    };
  };
};

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
export const createUseLogin = function createUseLogin(authenticator: Authenticator): UseLogin {
  return () => {
    const [, setCurrentUserId] = useAtom(currentUserIdAtom);
    const [status, setStatus] = useAtom(loginStatusAtom);
    const [loginError, setLoginError] = useAtom(loginErrorAtom);

    return {
      signIn(email, password) {
        setStatus(LoginStatus.Doing);

        authenticator
          .signIn(email, password)
          .then((userId) => {
            if (userId) {
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
      signUp(email, password) {
        setStatus(LoginStatus.Doing);

        authenticator
          .signUp(email, email, password)
          .then((userId) => {
            if (userId) {
              setCurrentUserId(userId);
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

      status,
      loginError,
    };
  };
};
