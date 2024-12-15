import { Authenticator } from "@spp/infra-authenticator/base";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { useLoginUser } from "./use-login-user.js";

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
 * `UseAuth` implementation
 */
export const useAuth: UseAuth = () => {
  const { loginUser } = useLoginUser();
  const [status, setStatus] = useAtom(authStatusAtom);
  const checkLogined = useCallback(() => {
    setStatus(AuthStatus.Checking);

    Authenticator.currentUserIdIfExists(undefined)
      .then((userId) => {
        if (!userId) {
          setStatus(AuthStatus.NotAuthenticated);
        } else {
          loginUser(userId);
          setStatus(AuthStatus.Authenticated);
        }
      })
      .catch(() => {
        setStatus(AuthStatus.NotAuthenticated);
      });
  }, [setStatus, loginUser]);

  const logout = useCallback(() => {
    loginUser(undefined);
    return Promise.resolve();
  }, [loginUser]);

  return {
    status,
    checkLogined,
    logout,
  };
};
