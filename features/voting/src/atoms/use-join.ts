import { User, Voting } from "@spp/shared-domain";
import { useAtomValue, useSetAtom } from "jotai";
import { JoinedVotingStatus } from "./type.js";
import { joinedVotingStatusAtom, joiningAtom, joinVotingAtom } from "./voting-atom.js";

/**
 * Definition of hook for join
 */
export type UseJoin = () => {
  status: JoinedVotingStatus;

  /**
   * Join login user into the voting
   */
  join: (userId: User.Id, id: Voting.Id) => void;

  /**
   * Loading status
   */
  loading: boolean;
};

/**
 * Create `UseJoin` with dependencies
 */
export const useJoin: UseJoin = function useJoin() {
  const status = useAtomValue(joinedVotingStatusAtom);
  const join = useSetAtom(joinVotingAtom);
  const loading = useAtomValue(joiningAtom);

  return {
    status,
    loading,
    join,
  };
};
