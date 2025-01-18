import { useSetAtom } from "jotai";
import { pullVotingUpdateAtom } from "./voting-atom.js";

/**
 * Definition of hook for voter role
 */
export type UsePullVotingUpdate = () => {
  /**
   * pull some update for current voting
   */
  pullUpdate: () => void;
};

/**
 * Create `UseVoter` hook with dependencies
 */
export const usePullVoitngUpdate: UsePullVotingUpdate = function useVoter() {
  const pullUpdate = useSetAtom(pullVotingUpdateAtom);

  return {
    pullUpdate,
  };
};
