import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { PollingPlace } from "./type.js";
import { pollingPlaceAtom } from "./voting-atom.js";

/**
 * Definition of hook for join
 */
export type UsePollnigPlace = () => {
  /**
   * Join login user into the voting
   */
  pollingPlace: PollingPlace | undefined;

  /**
   * Loading status
   */
  loading: boolean;
};

/**
 * Create `UseJoin` with dependencies
 */
export const usePollingPlace: UsePollnigPlace = function useJoin() {
  const status = useAtomValue(pollingPlaceAtom);

  const pollingPlace = useMemo(() => {
    if (status.state != "hasData") {
      return;
    }

    return status.data;
  }, [status]);

  const loading = useMemo(() => status.state === "loading", [status]);

  return {
    pollingPlace,
    loading: loading,
  };
};
