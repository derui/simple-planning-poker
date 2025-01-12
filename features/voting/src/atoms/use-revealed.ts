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

  return {
    loading,
    changeTheme,
    reset,
  };
};
