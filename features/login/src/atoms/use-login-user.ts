import { User } from "@spp/shared-domain";
import { useAtomValue } from "jotai";
import { loginedUserAtom } from "./atom.js";

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
 * `UseLoginUser` hook implementation
 */
export const useLoginUser: UseLoginUser = () => {
  const currentUserId = useAtomValue(loginedUserAtom);

  return {
    userId: currentUserId,
  };
};
