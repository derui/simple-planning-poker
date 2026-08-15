import { StoryPoint } from "@spp/shared-domain";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { changeThemeAtom, estimateAtom, pollingPlaceAtom, revealableAtom, revealAtom } from "./voting-atom.js";

/**
 * Definition of hook for voting
 */
export type UseVoting = () => {
  loading: boolean;

  /**
   * Revealable or not on current voting
   */
  revealable: boolean;

  /**
   * Login user estimated
   */
  estimated?: string;

  /**
   * Reveal current voting
   */
  reveal: () => void;

  /**
   * Change theme with `newTheme`
   */
  changeTheme: (newTheme: string) => void;

  /**
   * change estimation in voting
   */
  estimate: (estimation: number) => void;
};

/**
 * Create `UseVoting` hook with dependencies
 */
export const useVoting: UseVoting = function useVoting() {
  const revealable = useAtomValue(revealableAtom);
  const changeTheme = useSetAtom(changeThemeAtom);
  const pollingPlace = useAtomValue(pollingPlaceAtom);
  const _estimate = useSetAtom(estimateAtom);
  const reveal = useSetAtom(revealAtom);

  const estimate = useCallback(
    (estimation: number) => {
      if (!StoryPoint.isValid(estimation)) {
        return;
      }

      void _estimate(StoryPoint.create(estimation));
    },
    [_estimate]
  );

  const loading = useMemo(() => {
    return pollingPlace.state == "loading";
  }, [pollingPlace]);

  const estimated = useMemo(() => {
    if (pollingPlace.state != "hasData") {
      return;
    }

    const estimate = pollingPlace.data?.estimations?.find((estimation) => estimation.loginUser);

    return estimate?.estimated;
  }, [pollingPlace]);
  const changeThemeHandler = useCallback(
    (newTheme: string): void => {
      void changeTheme(newTheme);
    },
    [changeTheme]
  );
  const revealHandler = useCallback((): void => {
    void reveal();
  }, [reveal]);

  return {
    loading,
    revealable,
    estimated,
    changeTheme: changeThemeHandler,
    estimate,
    reveal: revealHandler,
  };
};
