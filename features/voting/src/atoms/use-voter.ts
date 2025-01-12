import { VoterType } from "@spp/shared-domain";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { UserRole } from "../components/types.js";
import { currentVoterRoleAtom } from "./voting-atom.js";

/**
 * Definition of hook for voter role
 */
export type UseVoter = () => {
  /**
   * Current voter's role
   */
  role: UserRole | undefined;
};

/**
 * Create `UseVoter` hook with dependencies
 */
export const useVoter: UseVoter = function useVoter() {
  const voterRole = useAtomValue(currentVoterRoleAtom);

  const role = useMemo<UserRole>(() => {
    return voterRole == VoterType.Normal ? "player" : "inspector";
  }, [voterRole]);

  return {
    role,
  };
};
