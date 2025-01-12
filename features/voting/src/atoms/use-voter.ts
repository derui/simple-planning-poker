import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import { currentVoterRoleAtom } from "./voting-atom.js";

/**
 * Definition of hook for voter role
 */
export type UseVoter = () => {
  /**
   * Current voter's role
   */
  role: VoterType | undefined;

  /**
   * Check if the current user is an inspector
   */
  isInspector: boolean;
};

/**
 * Create `UseVoter` hook with dependencies
 */
export const useVoter: UseVoter = function useVoter() {
  const role = useAtomValue(currentVoterRoleAtom);

  const isInspector = useMemo(() => {
    return role === VoterType.Inspector;
  }, [role]);

  return {
    role,
    isInspector,
  };
};
