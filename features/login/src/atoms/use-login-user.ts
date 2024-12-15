import { User } from "@spp/shared-domain";
import { atom, useAtom } from "jotai";

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
};

/**
 * `UseLoginUser` hook implementation
 */
export const useLoginUser: UseLoginUser = () => {
  const [currentUserId, setCurrentUserId] = useAtom(currentUserIdAtom);

  return {
    userId: currentUserId,
    loginUser: setCurrentUserId,
  };
};
