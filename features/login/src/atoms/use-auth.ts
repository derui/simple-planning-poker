import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { authStatusAtom, checkLoginedAtom, logoutAtom } from "./atom.js";
import { AuthStatus } from "./type.js";

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
  logout: () => void;
};

/**
 * `UseAuth` implementation
 */
export const useAuth: UseAuth = () => {
  const status = useAtomValue(authStatusAtom);
  const _checkLogined = useSetAtom(checkLoginedAtom);
  const _logout = useSetAtom(logoutAtom);
  const checkLogined = useCallback(() => _checkLogined(), [_checkLogined]);

  const logout = useCallback(() => _logout(), [_logout]);

  return {
    status,
    checkLogined,
    logout,
  };
};
