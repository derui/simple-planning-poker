import { VoterType } from "@spp/shared-domain";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import { UserRole } from "../components/types.js";
import { currentVoterRoleAtom, toggleRoleAtom } from "./voting-atom.js";

/**
 * Definition of hook for voter role
 */
export type UseVoter = () => {
  /**
   * Current voter's role
   */
  role: UserRole | undefined;
  /**
   * Function to toggle the voter's role
   */
  toggleRole: () => void;
};

/**
 * Create `UseVoter` hook with dependencies
 */
export const useVoter: UseVoter = function useVoter() {
  const voterRole = useAtomValue(currentVoterRoleAtom);
  const toggelRole = useSetAtom(toggleRoleAtom);

  const role = useMemo(() => {
    if (!voterRole) {
      return;
    }

    return voterRole == VoterType.Normal ? "player" : "inspector";
  }, [voterRole]);

  return {
    role,
    toggleRole: toggelRole,
  };
};
