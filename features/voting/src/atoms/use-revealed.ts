import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import { changeThemeAtom, pollingPlaceAtom, resetAtom } from "./voting-atom.js";

/**
 * Definition of hook for revealed voting
 */
export type UseRevealed = () => {
  loading: boolean;

  /**
   * Change theme with `newTheme`
   */
  changeTheme: (newTheme: string) => void;

  /**
   * Reset revealed voting
   */
  reset: () => void;

  /**
   * Average estimation from pollingPlace
   */
  averageEstimation: number | undefined;
};

/**
 * Create `UseRevealed` hook
 */
export const useRevealed: UseRevealed = function useRevealed() {
  const pollingPlace = useAtomValue(pollingPlaceAtom);
  const loading = useMemo(() => {
    return pollingPlace.state == "loading";
  }, [pollingPlace]);

  const changeTheme = useSetAtom(changeThemeAtom);
  const reset = useSetAtom(resetAtom);

  const averageEstimation = useMemo(() => {
    if (pollingPlace.state !== "hasData") {
      return 0;
    }

    const data = pollingPlace.data;
    if (!data) {
      return 0;
    }

    if (data.estimations && data.estimations.length > 0) {
      const total = data.estimations.reduce((sum, estimation) => sum + Number(estimation.estimated ?? "0"), 0);
      return total / data.estimations.length;
    }
    return undefined;
  }, [pollingPlace]);

  return {
    loading,
    changeTheme,
    reset,
    averageEstimation,
  };
};
