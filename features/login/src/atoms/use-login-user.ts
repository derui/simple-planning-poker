import { Authenticator } from "@spp/infra-authenticator/base";
import { User } from "@spp/shared-domain";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";

/**
 * User id that is logined.
 */
const currentUserIdAtom = atom<User.Id | undefined>();

/**
 * Login user hook
 */
export type UseLoginUser = () => {
  /**
   * Logined user id
   */
  readonly userId: User.Id | undefined;

  /**
   * Login user
   * @param userId
   */
  loginUser: (userId: User.Id | undefined) => void;

  /**
   *  Check login status
   */
  checkLoggedIn: () => void;
};

/**
 * `UseLoginUser` hook implementation
 */
export const useLoginUser: UseLoginUser = () => {
  const [currentUserId, setCurrentUserId] = useAtom(currentUserIdAtom);

  const checkLoggedIn = useCallback(async () => {
    const userId = await Authenticator.currentUserIdIfExists(undefined);
    if (userId) {
      setCurrentUserId(userId);
    }
  }, [currentUserId]);

  return {
    userId: currentUserId,
    loginUser: setCurrentUserId,
    checkLoggedIn,
  };
};
