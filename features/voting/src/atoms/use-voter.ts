import { VoterType } from "@spp/shared-domain";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import { UserRole } from "../components/types.js";
import { currentVoterRoleAtom, toggleRole } from "./voting-atom.js";

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
  const setToggleRole = useSetAtom(toggleRole);

  const role = useMemo<UserRole>(() => {
    return voterRole == VoterType.Normal ? "player" : "inspector";
  }, [voterRole]);

  return {
    role,
    toggleRole: setToggleRole,
  };
};
